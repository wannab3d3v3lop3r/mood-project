'use strict';

const express = require('express');

const { jwtAuth } = require('../auth/router')
const { Journal } = require('./model');
const { User } = require('../users/model');

const journalRouter = express.Router();

// journalRouter.use(jwtAuth);

journalRouter.get('/', (req,res) => {
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

journalRouter.get('/:id', jwtAuth, (req,res) => {
    Journal
        .findById(req.params.id)
        .then(user => {
            return res.status(200).json(user.serialize())
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

    const journalPost = {
        user: req.user.id,
        mood: req.body.mood,
        title: req.body.title,
        thoughts: req.body.thoughts,
        date: Date.now()
    }

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