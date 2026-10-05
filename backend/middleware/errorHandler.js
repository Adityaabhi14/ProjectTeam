// Centralized Error Handling Middleware for Express & MySQL
export function errorHandler(err, req, res, next) {
  console.error('API Error:', {
    message: err.message,
    code: err.code,
    errno: err.errno,
    sqlMessage: err.sqlMessage,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MySQL Specific Error Handling
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry error: A record with these unique details already exists.';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Foreign key constraint failed: Referenced parent record does not exist.';
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = 'Cannot delete or update record: It is referenced by other records.';
  } else if (err.code === 'ER_BAD_FIELD_ERROR') {
    statusCode = 400;
    message = 'Database field error: Invalid column name provided in query or payload.';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database service unavailable. Please check MySQL connection.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? (err.sqlMessage || err.message) : undefined
  });
}

// 404 Not Found Middleware
export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API Route not found - ${req.originalUrl}`
  });
}
