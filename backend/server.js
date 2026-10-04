import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/config.js';
import { testConnection } from './config/db.js';
import apiRouter from './routes/index.js';
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

// Serve Frontend Static Files from project root (index.html, style.css, script.js)
app.use(express.static(projectRoot));

// Mount REST API
app.use('/api', apiRouter);

// Fallback route to serve index.html for client-side navigation
app.get('/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'index.html'));
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
