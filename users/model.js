"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

//schema to represent a blog post
const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, requried: true}
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

// Never store a password directly out of security concerns.
// Hash the password before storing it.
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

// Since we don't ever store the user's raw password and instead store the hash,
// we can validate it by running it into the same hashing algorithm and comparing the results
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};