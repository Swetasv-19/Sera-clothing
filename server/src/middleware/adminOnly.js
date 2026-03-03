const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware: restrict route to users with role === 'admin'.
 * Must be used AFTER the `protect` middleware so req.user is available.
 */
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return next(
    new ErrorResponse('Access denied: admin privileges required', 403)
  );
};
