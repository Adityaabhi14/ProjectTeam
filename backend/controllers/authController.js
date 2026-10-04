import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { query } from '../config/db.js';

// User Registration
export async function register(req, res, next) {
  try {
    const { Username, Email, Password, Role = 'Patient', DoctorID, PatientID } = req.body;

    if (!Username || !Email || !Password) {
      return res.status(400).json({ success: false, message: 'Username, Email, and Password are required.' });
    }

    // Check existing
    const existing = await query('SELECT UserID FROM users WHERE Username = ? OR Email = ?', [Username, Email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'User with this username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(Password, salt);

    const result = await query(
      `INSERT INTO users (Username, Email, PasswordHash, Role, DoctorID, PatientID, IsActive)
       VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [Username, Email, passwordHash, Role, DoctorID || null, PatientID || null]
    );

    const token = jwt.sign(
      { id: result.insertId, username: Username, role: Role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        UserID: result.insertId,
        Username,
        Email,
        Role,
        DoctorID,
        PatientID
      }
    });
  } catch (error) {
    next(error);
  }
}

// User Login
export async function login(req, res, next) {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ success: false, message: 'Username and Password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE Username = ? OR Email = ?', [Username, Username]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = users[0];
    if (!user.IsActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact hospital admin.' });
    }

    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.UserID, username: user.Username, role: user.Role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

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
        PatientID: user.PatientID
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get current authenticated user profile
export async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}
