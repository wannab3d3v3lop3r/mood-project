'use strict';

const express = require('express');

const { User } = require('./model');
const { Journal } = require('../journal/model');

const userRouter = express.Router();

userRouter.get('/',(req,res) => {
    return User
        .find()
        .then(users => {
            res.status(200).json(users.map(user => user.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: `Internal server error`});
        })
});

userRouter.get('/:id',(req,res) => {
    return User
        .findById(req.params.id)
        .then(user => {
            res.status(200).json(user.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: `Internal server error`});
        })
});

userRouter.post('/', (req,res) => {

    //Check to see if the req.body consists of the requiredFields

    const requiredFields = ['username','password'];

    const missingFields = requiredFields.find(fields => !( fields in req.body ));

    console.log(`the request body through userRouter endpoint is ${JSON.stringify(req.body)} \n`);
    // console.log(`req.body went submitting to endpoint length ${JSON.stringify(req.body.username.length)} \n\n`);

    if(missingFields) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingFields
        });
    }

    //Make sure the values of each req.body are strings

    const stringField = ['username','password','firstName','lastName'];

    const nonStringField = stringField.find(
        //can do typeof field instead of 'string'
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if(nonStringField){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: nonStringField
        });
    }

    //Check to see if the user copied and pasted their info with spaces at the beginning or end

    const explicityTrimmedFields = ['username','password'];
    const nonTrimmedFields = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if(nonTrimmedFields){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedFields
        })
    }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 8,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field =>  {
            return ('min' in sizedFields[field] && 
                req.body[field].trim().length < sizedFields[field].min)
        }
    );

    const tooLargeField = Object.keys(sizedFields).find(
        field => {
            return ('max' in sizedFields[field] && 
                req.body[field].trim().length > sizedFields[field].max)
        }
    );

    console.log(`Value for tooSmallField is ${tooSmallField}`)
    console.log(`Value for tooLargeField is ${tooLargeField}`)
    
    if(tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        })
    }

    //Once the request values have been checked, store it into the database.

    let {username, password, firstName, lastName} = req.body;

    firstName = firstName.trim();
    lastName = lastName.trim();

    return User
        //check to see if the username is already inside the database
        .findOne({username})
        .then(username => {
            if(username) {
                return Promise.reject({
                    code: 422,
                    reason: `ValidationError`,
                    message: `username already taken`,
                    location: 'username'
                });
            }
            return User.hashPassword(password);
        })
        .then(hashPassword => {
            return User.create({
                username,
                password: hashPassword,
                firstName,
                lastName
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError'){
                return res.status(err.code).json(err);
            }

            console.log(`error is ${err}`);

            return res.status(500).json({code: 500, message: 'Internal server error'});
        });
});

userRouter.put('/:id', (req,res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
        console.error(message);
        // we return here to break out of this function
        return res.status(400).json({message: message});
    }

    const toUpdate = {};
    const updateableFields = ['password'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(journalPost => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

userRouter.delete('/:id',(req,res) => {
    Journal
        .remove({ user: req.params.id})
        .then(() => {
            User
            .findByIdAndRemove(req.params.id)
            .then(() => {
                console.log(`Deleted journal post owned by and author with id \`${req.params.id}\``);
                return res.status(204).end();
            })
            .catch(err => {
                return res.status(500).json({message: 'Internal server error'});
            });
        })
});

module.exports = {userRouter};