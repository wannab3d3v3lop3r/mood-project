'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./model');

const userRouter = express.Router();

userRouter.get('/',(req,res) => {
    User
        .find()
        .then(users => {
            res.json(users.map(user.serialize()));
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

    if(missingFields) {
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
            message: 'Missing field',
            location: missingField
        });
    }

    //Make sure the values of each req.body are stirngs

    const stringField = ['username','password','firstName','lastName'];

    const nonStringField = stringField.find(
        //can do typeof field instead of 'string'
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if(nonStringField){
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
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
        res.status(422).json({
            code: 422,
            reason: 'Validation Error',
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
            console.log(`sizedField with its field inside ${sizedField[field]}`);

            'min' in sizedFields[field] && 
                req.body[field].trim().length < sizedFields[field].min
                
        });

    const tooLargeField = Object.keys(sizedField).find(
        field => 
            'max' in sizedField[field] && 
                req.body[field].trim() > sizedFields[field].max
    );
    
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

    const {username, password, firstName, lastName} = req.body;

    firstName = firstName.trim();
    lastName = lastName.trim();

    return User
        .find({username: username})
        //check to see if the username is already inside the database
        .then(username => {
            if(username){
                return Promise.reject({
                    code: 422,
                    reason: `ValidationError`,
                    message: `username already taken`,
                    location: 'username'
                })
            }
            return User.hashPassword(password);
        })
        .then(hashPassword => {
            return User.create({
                username: username,
                password: hashPassword,
                firstName: firstName,
                lastName: lastName
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError'){
                return res.status(err.code).json(err);
            }

            return res.status(500).json({message: 'Internal server error'})
        });
});

module.exports = userRouter;