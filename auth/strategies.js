'use strict';

//renaming strategy to localStrategy.
//Can be imported this way:

//const { LocaStraegy } = require('passport-local').strategy;
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/model');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({ username: username })
    .then(_user => {
      console.log(`passed through .then()`)
      console.log(`_user is ${JSON.stringify(_user)}`)
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      console.log(`passed through .catch()`)
      if (err.reason === 'LoginError') {
        console.log(`error message inside if statement: ${JSON.stringify(err)}`)
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

//new JwtStrategy(options, verify)
//options is an object literal containing options to control how the token is extracted from the request or verified.
//
const jwtStrategy = new JwtStrategy(
  {
    //secretOrKey is a string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) 
    //for verifying the token's signature. REQUIRED unless secretOrKeyProvider is provided.
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    //jwtFromRequest (REQUIRED) Function that accepts a request as the only parameter and 
    //returns either the JWT as a string or null. See Extracting the JWT from the request for more details.
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
