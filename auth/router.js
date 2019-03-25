'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const authRouter = express.Router();

/*We use the jwt.sign function to create a signed JWT. The first argument is the payload, 
in this case an object containing the information about our user. 

The second argument is the secret key that we use to sign the JWT with. If this becomes public then anyone 
would be able to create a valid token, which would allow them to authenticate as any user. 
This means that it is vital that this piece of information isn't leaked, and remains on the server-side.

The third argument contains additional options and claims: we set up the sub and exp claims using the subject 
and expiresIn properties, and specify that we want to use the HS256 algorithm to sign the token. 
We default to the token expiring in one week (this is the exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; line in config.js). 

*/
const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

/*  which returns a middleware function. Store a reference to the middleware function in a variable, 
and pass it as the second argument to the .post endpoint. We set session to false to stop Passport 
from adding session cookies,  */
const localAuth = passport.authenticate('local', {session: false});
// The user provides a username and password to login
authRouter.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

//creates a middleware for all the endpoints
const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
authRouter.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = authRouter;
