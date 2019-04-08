'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { User } = require('../users/model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/user',function(){

    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function(){
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function(){

    })

    afterEach(function(){
        //removes data from the mongodb
        
        //User.remove({});

        return new Promise((resolve, reject) => {
            // Deletes the entire database.
            mongoose.connection.dropDatabase()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        });
    })

    after(function(){
        closeServer();
    })

    describe('GET METHOD',function(){

        it('returns an empty array', function(){
            return chai
                .request(app)
                .get('/api/user/')
                .then(res => {
                    console.log(`empty array is ${JSON.stringify(res.body)} \n\n`);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(0);
                })
        })
    })

    describe('POST METHOD', function(){

        it('create a new user',function(){

            let fakeUser = createFakerUser();

            return chai
                .request(app)
                .post('/api/user/')
                .send(fakeUser)
                .then(res => {
                    console.log
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('username','firstName','lastName','id');
                    expect(res.body.username).to.equal(fakeUser.username);
                    expect(res.body.firstName).to.equal(fakeUser.firstName);
                    expect(res.body.lastName).to.equal(fakeUser.lastName);
                    
                    return User.findOne({username: fakeUser.username})
                })
                .then(userFromDatabase => {
                    expect(userFromDatabase.username).to.equal(fakeUser.username);
                    expect(userFromDatabase.firstName).to.equal(fakeUser.firstName);
                    expect(userFromDatabase.lastName).to.equal(fakeUser.lastName);

                    //instead of using User.validatePassword,
                    //use the returned data to compare its hashed password to the password into the parameter
                    return userFromDatabase.validatePassword(fakeUser.password)
                })
                .then(passwordIsCorrect => {
                    expect(passwordIsCorrect).to.be.true;
                })
        })

        it('rejected if username is missing', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({password, firstName, lastName})
                .then(res => {
                    console.log(`Goes through then()`)
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('username');
                })
        })

        it('rejected if password is missing', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({username, firstName, lastName})
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('password');
                })
        })

        it('rejected if username has a non-string value', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({username: 1234, password, firstName, lastName})
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('username');
                })
        })

        it('rejected if password has a non-string value', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({username, password:1234, firstName, lastName})
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('password');
                })
        })

        it('rejected if firstName has a non-string value', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({username, password, firstName:1234, lastName})
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('firstName');
                })
        })

        it('rejected if lastName has a non-string value', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({username, password, firstName, lastName:1234})
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('lastName');
                })
        })

        it('rejected if username is already in the database', function(){

            let fakeUser = createFakerUser();

            //difference between using return and not using return
            return User.create(fakeUser)
                .then(() => {
                    return chai
                    .request(app)
                    .post('/api/user')
                    .send(fakeUser)
                    .then(res => {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('username already taken');
                        expect(res.body.location).to.equal('username');
                    })
                })
        })

        it('reject users with empty username', function(){

            return chai
                .request(app)
                .post('/api/user')
                .send({username: "", password, firstName, lastName})
                .then(res => {
                    console.log(`reject users with empty username ${JSON.stringify(res.body)} \n\n`)

                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Must be at least 1 characters long');
                    expect(res.body.location).to.equal('username');
                })
        })

        // it('reject users with a password with less than 8 characters', function(){

        //     return chai
        //         .request(app)
        //         .post('/api/user')
        //         .send({username, password: 'aaaaaaa', firstName, lastName})
        //         .then(res => {
        //             console.log(`reject users with a password with less than 8 characters ${JSON.stringify(res.body)} \n\n`)
        //             expect(res).to.have.status(422);
        //             expect(res.body.reason).to.equal('ValidationError');
        //             expect(res.body.message).to.equal('Must be at least 8 characters long');
        //             expect(res.body.location).to.equal('password');
        //         })
        // })

        // it('rejected if password is greater than 72', function(){

        //     return chai
        //         .request(app)
        //         .post('/api/user')
        //         .send({username, password: new Array(73).fill('a').join(''), firstName, lastName})
        //         .then(res => {
        //             console.log(`rejected if password is greater than 72 ${JSON.stringify(res.body)} \n\n`)
        //             expect(res).to.have.status(422);
        //             expect(res.body.reason).to.equal('ValidationError');
        //             expect(res.body.message).to.equal('Must be at most 72 characters long');
        //             expect(res.body.location).to.equal('password');
        //         })
        // })
    })
})

function createFakerUser(){
    return {
       firstName: `${faker.name.firstName()}`,
       lastName: `${faker.name.lastName()}`,
       username: `${faker.internet.userName()}`,
       password: `${faker.internet.password()}`
    }
}

