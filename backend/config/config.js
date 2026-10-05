import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_management_db',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    multipleStatements: true,
    dateStrings: true
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'carepoint_hospital_super_secret_jwt_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '702490979909-o88ogejgv8nlueu2df3k49nt53vp31c3.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/google/callback',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5000'
  }
};

export default config;
