"use strict";

const mongoose = require('mongoose');

//schema to represent a blog post
const journalPostSchema = mongoose.Schema({
    title: {type: String, required: true},
    thoughts: {type: String, required: true},
    // mood: {type: String, required: true},
    mood: {
        type: String, enum: ['happiness','sadness']
    },
    publishDate: {type: Date , required: true}
});

const JournalPost = mongoose.model("JouralPost", journalPostSchema);

module.exports = {JournalPost};