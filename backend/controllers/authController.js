import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import { query } from '../config/db.js';

// In-memory store for OAuth state nonces
const oauthStates = new Map();

// Helper to clean expired OAuth states
function cleanExpiredOAuthStates() {
  const now = Date.now();
  for (const [state, record] of oauthStates) {
    if (record.expiresAt <= now) {
      oauthStates.delete(state);
    }
  }
}

// ── Google OAuth Flow Handlers ─────────────────────────────────────

// 1. Initiate Google OAuth
export function initiateGoogleAuth(req, res) {
  cleanExpiredOAuthStates();

  const clientId = config.google.clientId;
  const redirectUri = config.google.redirectUri;

  if (!clientId || !config.google.clientSecret) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'
    });
  }

  const state = crypto.randomBytes(24).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');

  oauthStates.set(state, {
    nonce,
    returnUrl: req.query.returnUrl || '/',
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  res.cookie('carepoint_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.env === 'production',
    maxAge: 10 * 60 * 1000
  });

  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
    nonce
  }).toString();

  return res.redirect(googleUrl.toString());
}

// 2. Handle Google OAuth Callback
export async function handleGoogleCallback(req, res) {
  cleanExpiredOAuthStates();

  const { code, state, error } = req.query;
  const cookieState = req.cookies?.carepoint_oauth_state;

  res.clearCookie('carepoint_oauth_state');

  if (error) {
    console.warn('Google sign-in cancelled or denied:', error);
    return res.redirect('/?auth_error=google_cancelled');
  }

  const stateRecord = state ? oauthStates.get(state) : null;
  if (state) oauthStates.delete(state);

  if (!code || !state || (cookieState && state !== cookieState)) {
    return res.redirect('/?auth_error=invalid_oauth_state');
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: config.google.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error('Google token exchange error:', errBody);
      return res.redirect('/?auth_error=google_token_exchange_failed');
    }

    const tokens = await tokenResponse.json();

    // Fetch user profile from Google UserInfo endpoint
    let profile = { email: '', name: '', sub: '', picture: '' };
    if (tokens.access_token) {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      if (userRes.ok) {
        profile = await userRes.json();
      }
    }

    if (!profile.email) {
      return res.redirect('/?auth_error=no_email_provided');
    }

    const email = profile.email.toLowerCase().trim();
    const fullName = profile.name || profile.email.split('@')[0];
    const firstName = profile.given_name || fullName.split(' ')[0] || 'Patient';
    const lastName = profile.family_name || fullName.split(' ').slice(1).join(' ') || '';
    const picture = profile.picture || '';

    // Check if user exists in database
    let existingUsers = [];
    try {
      existingUsers = await query('SELECT * FROM users WHERE Email = ?', [email]);
    } catch (dbErr) {
      console.warn('DB query error during Google auth, proceeding in fallback mode:', dbErr.message);
    }

    let userId = null;
    let patientId = null;
    let role = 'Patient';

    if (existingUsers.length > 0) {
      const u = existingUsers[0];
      userId = u.UserID;
      role = u.Role;
      patientId = u.PatientID;

      // If patient record is missing, try to find or create one
      if (!patientId && role === 'Patient') {
        try {
          const patientMatches = await query('SELECT PatientID FROM patients WHERE Email = ?', [email]);
          if (patientMatches.length > 0) {
            patientId = patientMatches[0].PatientID;
            await query('UPDATE users SET PatientID = ? WHERE UserID = ?', [patientId, userId]);
          } else {
            const pRes = await query(
              `INSERT INTO patients (FirstName, LastName, Email, Phone, BloodGroup, RegistrationDate)
               VALUES (?, ?, ?, ?, 'O+', CURDATE())`,
              [firstName, lastName, email, '+91 9876543210']
            );
            patientId = pRes.insertId;
            await query('UPDATE users SET PatientID = ? WHERE UserID = ?', [patientId, userId]);
          }
        } catch (linkErr) {
          console.warn('Patient link error:', linkErr.message);
        }
      }
    } else {
      // Create new Patient and User
      try {
        const patientMatches = await query('SELECT PatientID FROM patients WHERE Email = ?', [email]);
        if (patientMatches.length > 0) {
          patientId = patientMatches[0].PatientID;
        } else {
          const pRes = await query(
            `INSERT INTO patients (FirstName, LastName, Email, Phone, BloodGroup, RegistrationDate)
             VALUES (?, ?, ?, ?, 'O+', CURDATE())`,
            [firstName, lastName, email, '+91 9876543210']
          );
          patientId = pRes.insertId;
        }

        const uRes = await query(
          `INSERT INTO users (Username, Email, PasswordHash, Role, PatientID, IsActive)
           VALUES (?, ?, 'GOOGLE_OAUTH_ACCOUNT', 'Patient', ?, TRUE)`,
          [email, email, patientId]
        );
        userId = uRes.insertId;
      } catch (insertErr) {
        console.warn('User insert error:', insertErr.message);
        userId = 999;
        patientId = 1;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, username: email, email, role, patientId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Fetch full patient data if available
    let patientDetails = null;
    if (patientId) {
      try {
        const pRows = await query('SELECT * FROM patients WHERE PatientID = ?', [patientId]);
        if (pRows.length > 0) {
          patientDetails = pRows[0];
        }
      } catch (err) {
        console.warn('Failed to fetch patient details:', err.message);
      }
    }

    const authPayload = {
      UserID: userId,
      Username: email,
      Email: email,
      Role: role,
      PatientID: patientId,
      name: fullName,
      picture,
      provider: 'google',
      patientDetails: patientDetails || {
        PatientID: patientId || 1,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: '+91 9876543210',
        BloodGroup: 'O+',
        Gender: 'Other',
        DOB: '1995-05-15'
      }
    };

    const tokenParam = encodeURIComponent(token);
    const userParam = encodeURIComponent(JSON.stringify(authPayload));

    return res.redirect(`/?auth_token=${tokenParam}&auth_user=${userParam}&auth_success=true#patient-profile`);
  } catch (error) {
    console.error('Google callback exception:', error);
    return res.redirect('/?auth_error=google_auth_failed');
  }
}

// ── Standard Username/Password & Patient Registration ──────────────

// User / Patient Registration
export async function register(req, res, next) {
  try {
    const {
      Username,
      Email,
      Password,
      Role = 'Patient',
      FirstName,
      LastName,
      Phone,
      Gender,
      BloodGroup,
      DOB,
      Address
    } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ success: false, message: 'Email and Password are required.' });
    }

    const cleanEmail = Email.toLowerCase().trim();
    const cleanUsername = (Username || cleanEmail).trim();

    // Check if user already exists
    const existing = await query('SELECT UserID FROM users WHERE Username = ? OR Email = ?', [cleanUsername, cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(Password, salt);

    let patientId = null;

    // If registering as Patient, create or link patient record
    if (Role === 'Patient') {
      const fName = FirstName || cleanUsername.split('@')[0] || 'Patient';
      const lName = LastName || '';
      const phoneNum = Phone || '+91 9876543210';

      const pRes = await query(
        `INSERT INTO patients (FirstName, LastName, DOB, Gender, BloodGroup, Phone, Email, Address, RegistrationDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [fName, lName, DOB || '1995-01-01', Gender || 'Other', BloodGroup || 'O+', phoneNum, cleanEmail, Address || '']
      );
      patientId = pRes.insertId;
    }

    const result = await query(
      `INSERT INTO users (Username, Email, PasswordHash, Role, PatientID, IsActive)
       VALUES (?, ?, ?, ?, ?, TRUE)`,
      [cleanUsername, cleanEmail, passwordHash, Role, patientId]
    );

    const token = jwt.sign(
      { id: result.insertId, username: cleanUsername, role: Role, patientId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    let patientDetails = null;
    if (patientId) {
      const pRows = await query('SELECT * FROM patients WHERE PatientID = ?', [patientId]);
      if (pRows.length > 0) patientDetails = pRows[0];
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        UserID: result.insertId,
        Username: cleanUsername,
        Email: cleanEmail,
        Role,
        PatientID: patientId,
        name: FirstName ? `${FirstName} ${LastName || ''}`.trim() : cleanUsername,
        provider: 'local',
        patientDetails
      }
    });
  } catch (error) {
    next(error);
  }
}

// User / Patient Login
export async function login(req, res, next) {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ success: false, message: 'Username/Email and Password are required.' });
    }

    const cleanInput = Username.toLowerCase().trim();
    const users = await query('SELECT * FROM users WHERE Username = ? OR Email = ?', [cleanInput, cleanInput]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = users[0];
    if (!user.IsActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact hospital administration.' });
    }

    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.UserID, username: user.Username, role: user.Role, patientId: user.PatientID, doctorId: user.DoctorID },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    let patientDetails = null;
    if (user.PatientID) {
      const pRows = await query('SELECT * FROM patients WHERE PatientID = ?', [user.PatientID]);
      if (pRows.length > 0) patientDetails = pRows[0];
    }

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        UserID: user.UserID,
        Username: user.Username,
        Email: user.Email,
        Role: user.Role,
        DoctorID: user.DoctorID,
        PatientID: user.PatientID,
        name: patientDetails ? `${patientDetails.FirstName} ${patientDetails.LastName || ''}`.trim() : user.Username,
        provider: 'local',
        patientDetails
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get current authenticated user profile + complete patient info
export async function getMe(req, res, next) {
  try {
    let patientDetails = null;
    if (req.user.PatientID) {
      const pRows = await query('SELECT * FROM patients WHERE PatientID = ?', [req.user.PatientID]);
      if (pRows.length > 0) patientDetails = pRows[0];
    }

    res.json({
      success: true,
      user: {
        ...req.user,
        name: patientDetails ? `${patientDetails.FirstName} ${patientDetails.LastName || ''}`.trim() : req.user.Username,
        patientDetails
      }
    });
  } catch (error) {
    next(error);
  }
}

// Update current user/patient profile
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.UserID;
    const {
      FirstName,
      LastName,
      Phone,
      Email,
      DOB,
      Gender,
      BloodGroup,
      Address,
      EmergencyContactName,
      EmergencyContactPhone,
      AadhaarNo
    } = req.body;

    let patientId = req.user.PatientID;

    if (!patientId) {
      // Create a patient record if user doesn't have one
      const pRes = await query(
        `INSERT INTO patients (FirstName, LastName, DOB, Gender, BloodGroup, Phone, Email, Address, EmergencyContactName, EmergencyContactPhone, AadhaarNo, RegistrationDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [
          FirstName || 'Patient',
          LastName || '',
          DOB || null,
          Gender || 'Other',
          BloodGroup || 'O+',
          Phone || '+91 9876543210',
          Email || req.user.Email,
          Address || '',
          EmergencyContactName || '',
          EmergencyContactPhone || '',
          AadhaarNo || ''
        ]
      );
      patientId = pRes.insertId;
      await query('UPDATE users SET PatientID = ? WHERE UserID = ?', [patientId, userId]);
    } else {
      // Update existing patient record
      await query(
        `UPDATE patients 
         SET FirstName = COALESCE(?, FirstName),
             LastName = COALESCE(?, LastName),
             Phone = COALESCE(?, Phone),
             Email = COALESCE(?, Email),
             DOB = COALESCE(?, DOB),
             Gender = COALESCE(?, Gender),
             BloodGroup = COALESCE(?, BloodGroup),
             Address = COALESCE(?, Address),
             EmergencyContactName = COALESCE(?, EmergencyContactName),
             EmergencyContactPhone = COALESCE(?, EmergencyContactPhone),
             AadhaarNo = COALESCE(?, AadhaarNo)
         WHERE PatientID = ?`,
        [
          FirstName,
          LastName,
          Phone,
          Email,
          DOB,
          Gender,
          BloodGroup,
          Address,
          EmergencyContactName,
          EmergencyContactPhone,
          AadhaarNo,
          patientId
        ]
      );
    }

    // Also update users email/username if changed
    if (Email && Email !== req.user.Email) {
      await query('UPDATE users SET Email = ? WHERE UserID = ?', [Email, userId]);
    }

    const updatedPatient = await query('SELECT * FROM patients WHERE PatientID = ?', [patientId]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedPatient[0]
    });
  } catch (error) {
    next(error);
  }
}

