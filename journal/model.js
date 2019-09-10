"use strict";

const mongoose = require('mongoose');

//schema to represent a blog post
const JournalSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    thoughts: {type: String, required: true},
    mood: {
        type: String, enum: ['happy','sad','anger','normal']
    },
    publishDate: {type: Date , required: true, default: Date.now}
});

//substring(0,10)

JournalSchema.pre('find', function(next) {
  this.populate('User');
  next();
})

JournalSchema.pre('findOne', function(next) {
  this.populate('User');
  next();
})

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
JournalSchema.methods.serialize = function() {

  let user;
  // We serialize the user if it's populated to avoid returning any sensitive information, like the password hash.
  if (typeof this.user.serialize === 'function') {
      user = this.user.serialize();
  } else {
      user = this.user;
  }

  return {
    id: this._id,
    user: user,
    mood: this.mood,
    title: this.title,
    thoughts: this.thoughts,
    publishDate: this.publishDate
  };
};

const Journal = mongoose.model("Journal", JournalSchema);

module.exports = {Journal};