// Import necessary modules. These are libraries that provide various functionalities to your app.
// Express is a web application framework, bodyParser helps in parsing incoming request bodies, 
// mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, multer is primarily used for uploading files
// (handling multipart/form-data).
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

// Import the routes for the feed and auth. These are the routes that will be used to handle requests to the server.
// The routes are defined in the routes folder and are imported here.
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// Create an instance of the express application. This is the main object that will be used to handle requests to the server.
const app = express();

// Set up the file storage configuration for multer. This is used to specify where the files will be stored and how they will be named.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

// Set up the file filter configuration for multer. This is used to specify which files are allowed to be uploaded.
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

// Set up the middleware for the express application. Middleware are functions that have access to the request object (req),
// the response object (res), and the next middleware function in the application’s request-response cycle.
// These functions are used to modify the request and response objects, and to end the request-response cycle.
// The middleware used here is used to parse the incoming request body and to serve the images folder statically.
// The app.use() function is used to mount the specified middleware function(s) at the path which is being specified.
// The middleware function is passed to the app.use() function as an argument.
// The middleware function is executed when the base of the requested path matches path.

app.use(bodyParser.json()); // application/json


// The app.use() function is used to specify the middleware function that will be used to serve the images folder statically.

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

// Set the headers for the response. This is used to specify the headers that will be sent with the response.
// The headers are used to specify the allowed methods, allowed headers, and allowed origin for the request.
// The headers are set using the res.setHeader() function, which is used to set the value of the specified header.
// The res.setHeader() function is used to set the value of the specified header.
// The res.setHeader() function is called for each header that needs to be set.

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Set up the routes for the express application. This is used to specify the routes that will be used to handle requests to the server.
// The routes are set using the app.use() function, which is used to specify the middleware function that will be used to handle the request.

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Set up the error handling middleware for the express application. 
// This is used to specify the middleware function that will be used to handle errors.
// The error handling middleware function is used to catch errors that are thrown in the application.
// The error handling middleware function is passed to the app.use() function as an argument.

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Connect to the MongoDB database using mongoose. This is used to connect to the MongoDB database using the mongoose library.
// The mongoose.connect() function is used to connect to the MongoDB database.
// The mongoose.connect() function is passed the connection string as an argument.
// The connection string is used to specify the location of the MongoDB database.
// The mongoose.connect() function returns a promise, which is used to handle the result of the connection attempt.
// The .then() function is used to handle the result of the connection attempt.
mongoose
  .connect(
    'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/messages?retryWrites=true'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
