"use strict";

// afterEach error ?

// 

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_EXPIRY, JWT_SECRET } = require('../config');
const { app, runServer, closeServer } = require("../server");
const { Journal } = require('../journal/model');
const { User } = require('../users/model');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Testing /api/journal-post", function() {
    let testUser, jwtToken;

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        testUser = createFakerUser();

        return User.hashPassword(testUser.password)
            .then(hashPassword => {
                return User.create({
                    username: testUser.username,
                    password: hashPassword,
                    firstName: testUser.firstName,
                    lastName: testUser.lastName
                })
            })
            .then(createdUser => {
                console.log(`Created user inside database is ${JSON.stringify(createdUser)}`)
                console.log('\n');
                testUser.id = createdUser.id;

                jwtToken = jsonwebtoken.sign(
                    {
                        user: {
                            id: testUser.id,
                            firstName: testUser.firstName,
                            lastName: testUser.lastName,
                            username: testUser.username
                        }
                    }, 
                        JWT_SECRET, 
                        {
                            subject: testUser.username,
                            expiresIn: JWT_EXPIRY,
                            algorithm: 'HS256'
                        }
                );

                const seedData = [];

                for (let i = 0; i < 10; i++) {
                    const newJournal = createFakerNote();
                    newJournal.user = testUser.id;
                    seedData.push(newJournal);
                }
                return Journal.insertMany(seedData)

        })
    });

    after (function (){
        return closeServer();
    });

    afterEach(function(){

        return new Promise((resolve, reject) => {
            mongoose.connection.dropDatabase()
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.log('error inside catch is ' + err);
                reject(err);
            })
        })

    });

    describe('Post',function(){
        it('Should return all journal posts', function () {
            return chai.request(app)
                .get('/api/journal-post/all')
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf.at.least(1);
                    const journal = res.body[0];
                    console.log('journal user is ' + JSON.stringify(journal));
                    console.log('\n');
                    console.log(`testUser is ${JSON.stringify(testUser)}`);

                    expect(journal).to.include.keys('user', 'title', 'thoughts','mood');
                    expect(journal).to.be.a('object');
                    // compare persisted journal information to the user. I only have the ID

                    // expect(journal).to.include({
                    //     user: testUser.id,
                    //     mood: testUser.mood,
                    //     title: testUser.title,
                    //     thoughts: testUser.thoughts
                    // })
            })
        });

        it('Should return a specific note',function(){
            let foundJournal = {};

            return Journal.find()
                .then(journals => {
                    expect(journals).to.be.a('array');
                    expect(journals).to.have.lengthOf.at.least(1);
                    
                    foundJournal = journals[0];
                
                    console.log('foundJournal is ' + JSON.stringify(foundJournal));
                    console.log('\n');

                    return chai.request(app)
                        .get(`/api/journal-post/${foundJournal.id}`)
                        .set(`Authorization`,`Bearer ${jwtToken}`)
                })
                .then(res => {
                    console.log('foundJournal inside then() is ' + JSON.stringify(foundJournal));
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('user','mood','title','thoughts');
                    expect(res.body).to.deep.include({id: foundJournal.id});
                    expect(res.body).to.deep.include({title: foundJournal.title});
                    expect(res.body).to.deep.include({thoughts: foundJournal.thoughts});
                })
        })

        it(`Should return all of the user's journal posts`,function(){

            return chai.request(app)
                        .get('/api/journal-post/')
                        .set(`Authorization`,`Bearer ${jwtToken}`)
                        .then(res => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.a('object');
                            const journal = res.body[0];
                            expect(journal).to.include.keys('user', 'title', 'thoughts','mood');
                            expect(journal).to.be.a('object');
                        })
        })

        it('Should update a specific note', function(){
            let journalToUpdate;
            const newJournalData = createFakerNote();

            return Journal.find()
                .then(journals => {
                    expect(journals).to.be.a('array');
                    expect(journals).to.have.lengthOf.at.least(1);
                    journalToUpdate = journals[0];
                    newJournalData.id = journalToUpdate.id;

                    return chai.request(app)
                        .put(`/api/journal-post/${journalToUpdate.id}`)
                        .set(`Authorization`,`Bearer ${jwtToken}`)
                        .send(newJournalData);
                })
                .then(res => {
                    console.log('\n');
                    expect(res).to.have.status(204);
                    return Journal.findById(journalToUpdate.id);
                })
                .then(journal => {
                    expect(journal).to.be.a('object');
                    expect(journal).to.deep.include({
                        id: newJournalData.id, 
                        title: newJournalData.title, 
                        mood: newJournalData.mood, 
                        thoughts: newJournalData.thoughts
                    });
                })
        })

        it('Should delete a journal post', function(){

            let deleteJournal;

            return Journal.findOne()
                .then(journal => {
                    expect(journal).to.be.a('object');

                    deleteJournal = journal;

                    return chai.request(app)
                        .delete(`/api/journal-post/${deleteJournal.id}`)
                        .set(`Authorization`,`Bearer ${jwtToken}`)
                })
                .then(res => {
                    expect(res).to.have.status(204)

                    return Journal.findById(deleteJournal.id)
                })
                .then(journal => {
                    expect(journal).to.not.exist;
                })
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

    function createFakerNote() {
        return {
            title: faker.lorem.sentence(),
            thoughts: faker.lorem.paragraphs(),
            mood: 'happy'
        };
    }
});
