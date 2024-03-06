// Auth middleware to check if user is authenticated
// This middleware is used to check if the user is authenticated. It is used to protect routes that require authentication.
// If the user is not authenticated, an error is thrown.
// This middleware is used in the routes/feed.js file to protect the routes that require authentication.
// The middleware is used to check if the user is authenticated by checking the token that is sent with the request.
// If the token is not valid, an error is thrown.
// If the token is valid, the user is authenticated and the request is allowed to continue.
// The middleware is used to check if the user is authenticated by checking the token that is sent with the request.

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
