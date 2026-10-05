import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('🚀 Initializing MySQL Database for Hospital Management System...');
  
  // Connect to MySQL server without specific database to create DB if needed
  const connectionConfig = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log(` Connected to MySQL server at ${config.db.host}:${config.db.port}`);

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(` Database '${config.db.database}' verified/created.`);

    // Switch to database
    await connection.query(`USE \`${config.db.database}\`;`);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      console.log(' Applying schema.sql...');
      await connection.query(schemaSql);
      console.log(' Schema tables created successfully (15 ER entities + Users).');
    }

    // Read and execute seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      console.log(' Applying seed.sql...');
      await connection.query(seedSql);
      console.log(' Initial seed data inserted successfully.');
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️ Please check that your MySQL server is running and accessible with credentials in .env');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
