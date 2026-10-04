import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { query } from '../config/db.js';

// Verify JWT token middleware
export async function authenticateToken(req, res, next) {
  let token;

  // Check Authorization header (Bearer <token>)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Check cookies
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check user active status in database
    const users = await query('SELECT UserID, Username, Email, Role, DoctorID, PatientID, IsActive FROM users WHERE UserID = ?', [decoded.id || decoded.UserID]);
    if (!users || users.length === 0 || !users[0].IsActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or account is deactivated.'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message
    });
  }
}

// Role-based authorization middleware
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.Role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
}
