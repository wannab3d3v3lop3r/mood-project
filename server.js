const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const { journalRouter } = require('./journal/router');
const { userRouter } = require('./users/router');
const { authRouter } = require('./auth/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');

const app = express();

app.use(morgan('common'));
app.use(express.static('/public'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

//MIDDLEWARE
passport.use(localStrategy); //Passport to use our localStrategy when receiving Username + password combination
passport.use(jwtStrategy); //Passport to use our jwtStrategy when receiving JWT

app.use(morgan("common")); // log the http layer
app.use(express.json()); // AJAX request JSON data payload can be parsed and saved into request.body
app.use(express.static('public')); //Intercepts al HTTP requests that match files inside /public

app.use('/api/user/',userRouter);
app.use('/api/journal-post/', journalRouter);
app.use('/api/auth/', authRouter);

//If any user enters a random endpoint, returns a not found message
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  //returns a promise because we want to be notified once the server starts

  /*
    instead of having two parameters in runServer, can have one since both PORT and DATABASE_URL
    has been declared globally. Use one parameter and use a if statement to see if its a mongo url or test url

    if runServer has an empty parameter, it goes to the else statement

    return new Promise((resolve,reject) => {})

    let mongoUrl;

    if(databaseUrl) {
      mongoUrl = TEST_MONGO_URL;
    }
    else{
      mongoUrl = MONGO_URL; 
    }
  
    mongoose.connect(mongoUrl ...)
  })
  */

  return new Promise((resolve, reject) => {
    //Attempt to connect MongoDb with mongoose
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }

      //Start Express server
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          console.log(err);
          reject(err);
        });
    });
  });

}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      //Shut down the ExpressJS server
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// `closeServer` function is here in original code

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.

// When we open this file in order to import app and runServer in a test module, we don't want the server to automatically run,
// and this conditional block makes that possible.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

//export for test purposes
module.exports = {runServer, app, closeServer};