import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  initiateGoogleAuth,
  handleGoogleCallback
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Email / Password Registration & Login
router.post('/register', register);
router.post('/login', login);

// Authenticated User Profile
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

// Google OAuth 2.0 Flow
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

export default router;

