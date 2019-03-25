"use strict";

const mongoose = require('mongoose');

//schema to represent a blog post
const JournalSchema = mongoose.Schema({
    title: {type: String, required: true},
    thoughts: {type: String, required: true},
    mood: {
        type: String, enum: ['happiness','sadness','happy']
    },
    publishDate: {type: Date , required: true}
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
JournalSchema.methods.serialize = function() {
  return {
    id: this._id,
    mood: this.mood,
    title: this.title,
    thoughts: this.thoughts,
    publishDate: this.publishDate
  };
};

const Journal = mongoose.model("Journal", JournalSchema);

module.exports = {Journal};