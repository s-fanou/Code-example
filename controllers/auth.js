// Desc: This file contains the logic for user authentication. It contains two functions: signup and login. The signup function is used to create a new user in the database. The login function is used to log in an existing user. Both functions use the bcryptjs library to hash the password before storing it in the database. The login function also uses the jsonwebtoken library to create a token for the user when they log in. This token is then sent back to the client and can be used to authenticate the user for future requests.
// The signup function uses the express-validator library to validate the input data before creating a new user. The login function uses the bcryptjs library to compare the hashed password with the password entered by the user. If the passwords match, a token is created using the jsonwebtoken library and sent back to the client.
// The functions are exported to be used in the routes/auth.js file.
// The functions are used in the routes/auth.js file to handle the requests to the /signup and /login paths.
// The functions are used to create a new user in the database and to log in an existing user.

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  //if there are errors during validation in routes/auth.js then express-validator puts them in the req object
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');//this error message will go into the error.message
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
