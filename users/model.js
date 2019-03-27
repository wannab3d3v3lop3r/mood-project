"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//schema to represent a blog post
const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, requried: true}
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

// Never store a password directly out of security concerns.
// Hash the password before storing it.
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

// Since we don't ever store the user's raw password and instead store the hash,
// we can validate it by running it into the same hashing algorithm and comparing the results
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = {User};