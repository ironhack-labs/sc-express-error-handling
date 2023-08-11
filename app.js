const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const PORT = 5005;
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());


// ROUTES

// Example: Default Error Handling
app.get('/', (req, res) => {
  // Express will catch this by default
  throw new Error('Something went wrong!');
});


// Example: Async Code - Uncaught  Errors and Rejected Promises
const someAsyncTask = () => {
  // We are intentionally rejecting a promise
  return Promise.reject("Oops... Promise rejected!"); 
}

app.get("/crash-server-example", (req, res) => {

  someAsyncTask()     // Calling this function results in a rejected promise
    .then((result) => {
          res.send(result);
      });

    // ^ Note the missing `catch` block to handle errors and promise rejection. 
    // This will crash the server!

});



// Example: Async Code - Handling Errors and Rejected Promises - next()

const getDataFromDatabase = () => {
  // We are intentionally rejecting the promise to simulate a failed database operation.
  return Promise.reject("Failed to retrieve the data from database.");
}

app.get("/data", (req, res, next) => {

  // Async operation that returns a promise. 
  // The promise is rejected, simulating a failed database operation.
  getDataFromDatabase()
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      // Catching the rejected promise and passing the error to next()
      next(error);
    });
});


// Example - Custom Error Handling Middleware - next()

//  1. Create a custom error handling middleware: 
//       See file ./middleware/error-handling.js
 
//  2. Import the custom error handling middleware:
const { errorHandler, notFoundHandler } = require("./middleware/error-handling");

//  3. Set up custom error handling middleware:
//      Note: The order of the error handlers is important! 
//      Ensure that the error middleware is registered at the end, after all the other routes.
//      The Not Found 404 middleware should be registered last, after all the other routes, but before the custom error handler.
app.use(errorHandler);
app.use(notFoundHandler);



// START SERVER
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
