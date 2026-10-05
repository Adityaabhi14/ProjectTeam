import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import config from './config/config.js';
import { testConnection } from './config/db.js';
import apiRouter from './routes/index.js';
import { initiateGoogleAuth, handleGoogleCallback } from './controllers/authController.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// ── Google OAuth Direct Callbacks (Matching Google Cloud Console) ──
app.get('/google', initiateGoogleAuth);
app.get('/google/callback', handleGoogleCallback);

// ── Static File Serving ────────────────────────────────────────────
// Prefer the compiled React build (frontend/dist) when it exists.
// Fall back to the project root for legacy plain-HTML mode.
const frontendDist = path.resolve(__dirname, '../frontend/dist');
const hasDist = fs.existsSync(path.join(frontendDist, 'index.html'));

if (hasDist) {
  // Serve compiled React app assets
  app.use(express.static(frontendDist));
} else {
  // Fallback: serve project-root static files (style.css, script.js, etc.)
  app.use(express.static(projectRoot));
}

// Mount REST API
app.use('/api', apiRouter);

// SPA / HTML fallback — must come AFTER API routes
app.get('/{*path}', (req, res) => {
  if (hasDist) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  } else {
    res.sendFile(path.join(projectRoot, 'index.html'));
  }
});

// General 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, async () => {
  console.log('\n======================================================');
  console.log(`🏥 CarePoint Hospital Management System Backend Running`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🔌 REST API Base: http://localhost:${config.port}/api`);
  console.log(`🩺 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`🗄️ MySQL Database: ${config.db.database} (${config.db.host}:${config.db.port})`);
  console.log('======================================================\n');

  // Test MySQL Connection
  await testConnection();
});

export default app;
