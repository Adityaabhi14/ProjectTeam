import mysql from 'mysql2/promise';
import config from './config.js';

// Create connection pool
export const pool = mysql.createPool(config.db);

// Helper function to execute queries
export async function query(sql, params = []) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error('Database Query Error:', error.message, '\nSQL:', sql, '\nParams:', params);
    throw error;
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`Connected to MySQL database: ${config.db.database} at ${config.db.host}:${config.db.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.warn(`Database connection warning: ${error.message}. Ensure MySQL server is running and database exists.`);
    return false;
  }
}

export default {
  pool,
  query,
  testConnection
};
