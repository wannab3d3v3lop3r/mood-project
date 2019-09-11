'use strict';

const express = require('express');

const { jwtAuth } = require('../auth/router')
const { Journal } = require('./model');
const { User } = require('../users/model');

const journalRouter = express.Router();

// journalRouter.use(jwtAuth);

journalRouter.get('/all', (req,res) => {
    Journal
      .find()
      .then(journalPosts => {
        return res.json(journalPosts.map(journalPost => journalPost.serialize()));
      })
    .catch(
      err => {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
      }
    )
});

//gets all the journal posts of the logged in user
journalRouter.get('/', jwtAuth, (req,res) => {
    Journal
        .find({user: req.user.id})
        .then(notes => {
            return res.status(200).json(notes.map(note => note.serialize()))
        })
        .catch(err => {
            return res.status(500).json(err);
        })
})

//gets one journal post by id
journalRouter.get('/:id', jwtAuth, (req,res) => {
    Journal
        .findById(req.params.id)
        .then(note => {
            return res.status(200).json(note.serialize())
        })
        .catch(err => {
            return res.status(500).json(err);
        })
})
  
journalRouter.post('/', jwtAuth, (req,res) => {
    const requiredFields = ['mood', 'title', 'thoughts'];

    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if(req.body.mood === "Choose a mood"){
        return res.status(400).send('Please choose a mood value')
    }

    const journalPost = {
        user: req.user.id,
        mood: req.body.mood,
        title: req.body.title,
        thoughts: req.body.thoughts,
        publishDate: new Date()
    }

    console.log(`mood value is `,req.body.mood)

    Journal
        .create(journalPost)
        .then(journalPost => {
            return res.status(201).json(journalPost.serialize())
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({message: 'Internal server error'})
        })
});

journalRouter.put('/:id', jwtAuth, (req,res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
        console.error(message);
        // we return here to break out of this function
        return res.status(400).json({message: message});
    }

    const toUpdate = {};
    const updateableFields = ['mood', 'title', 'thoughts'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Journal
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(journalPost => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

journalRouter.delete('/:id', jwtAuth, (req,res) => {
    Journal
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {journalRouter};