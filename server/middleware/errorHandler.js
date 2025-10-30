
const errorHandler = (err, req, res, next) => {
  let error = { 
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };


  // Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    error.message = 'Validation Error';
    error.details = err.errors.map(e => e.message);
    error.statusCode = 400;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    error.message = 'Duplicate entry';
    error.statusCode = 400;
  }

  if (err.name === 'SequelizeDatabaseError') {
    error.message = 'Database error';
    error.statusCode = 500;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Cast errors (like invalid ID)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.statusCode = 400;
  }

  // Response
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(error.details && { details: error.details }),
    ...({ stack: err.stack })
  });
};

export default errorHandler;