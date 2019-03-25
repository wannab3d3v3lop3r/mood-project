'use strict';

const express = require('express');
const {Journal} = require('./model');

const router = express.Router();

router.get('/', (req,res) => {
    Journal
      .find()
      .then(journalPosts => {
        res.json(
          journalPosts.map((journalPost) => journalPost.serialize())
        );
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      }
    )
});
  
router.post('/', (req,res) => {
    const requiredFields = ['mood', 'title', 'thoughts'];

    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Journal
        .create({
            mood: req.body.mood,
            title: req.body.title,
            thoughts: req.body.thoughts,
            date: req.body.publishDate
        })
        .then(
            journalPost => res.status(201).json(journalPost.serialize())
        )
        .catch(err =>{
            console.error(error);
            res.status(500).json({message: 'Internal server error'})
        });
});

router.put('/:id', (req,res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
        `Request path id (${req.params.id}) and request body id ` +
        `(${req.body.id}) must match`);
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

router.delete('/:id',(req,res) => {
    Journal
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;