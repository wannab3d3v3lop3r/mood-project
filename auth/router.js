'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {JWT_EXPIRY, JWT_SECRET} = require('../config');

const authRouter = express.Router();


const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false}, function(nullerror, boolean, err){
  console.log(`error message is`, err.message);
  if(err){
    return err
  }
});

authRouter.post('/login', localAuth, (req, res) => {
  let user = req.user.serialize();
  const authToken = createAuthToken(user);
  res.json({authToken, user});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

authRouter.post('/refresh', jwtAuth, (req, res) => {
  let user = req.user
  const authToken = createAuthToken(user);
  res.json({authToken, user});
});

module.exports = {authRouter, localAuth, jwtAuth};
