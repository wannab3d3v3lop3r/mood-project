"use strict";

// When the test runs, it hashPassword but doesn't go into neither then or catch blocks.
// No data entry was inputted for the database
const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL, JWT_EXPIRY, JWT_SECRET } = require('../config');
const { runServer, closeServer, app } = require('../server');
const { User } = require('../users/model');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints',function(){

    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function(){
        return runServer(TEST_DATABASE_URL);
    })

    after(function(){
        return closeServer();
    })

    beforeEach(function(){
    })

    afterEach(function(){
        return new Promise((resolve,reject) => {
            mongoose.connection.dropDatabase()
                .then(result => {
                    resolve(result);
                })
                .catch(err =>{
                    reject(err);
                    console.error(err);
                })
        })
    })

    describe('/api/auth/login',function(){

        it('Should reject requests with no credentials', function(){
          return User.hashPassword(password)
          .then(password => {
              return User.create({
                  username,
                  password,
                  firstName,
                  lastName
              })
          })
          .then(user => {
            return chai
              .request(app)
              .post('/api/auth/login')
              .then(res => {
                  expect(res).to.have.status(400);
              })
          })
      })

        it('Should reject with incorrect username', function(){
          return User.hashPassword(password)
          .then(password => {
              return User.create({
                  username,
                  password,
                  firstName,
                  lastName
              })
          })
          .then(user => {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({username: 'wrongUser', password})
                .then(res => {
                    expect(res).to.have.status(401);
                })
          })
      })

        it('Should reject with incorrect password', function(){
          return User.hashPassword(password)
          .then(password => {
              return User.create({
                  username,
                  password,
                  firstName,
                  lastName
              })
          })
          .then(user => {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({username, password: 'wrongPassword'})
                .then(res => {
                    expect(res).to.have.status(401);
                })
          })
        })

        it('Should return a valid auth token', function(){
            return User.hashPassword(password)
              .then(password => {
                  return User.create({
                      username,
                      password,
                      firstName,
                      lastName
                  })
            })
            .then(user => {
                return chai
                    .request(app)
                    .post('/api/auth/login')
                    .send({ username, password })
                    .then(res => {

                        console.log(`auth token response is ${JSON.stringify(res)}`);
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        const token = res.body.authToken;
                        expect(token).to.be.a('string');
                        const payload = jwt.verify(token, JWT_SECRET, {
                            algorithm: ['HS256']
                        });
                        expect(payload.user.username).to.deep.equal(username);
                        expect(payload.user.firstName).to.deep.equal(firstName)
                        expect(payload.user.lastName).to.deep.equal(lastName);     
                    })
                })
            })
    })

    describe('/api/auth/refresh', function(){
        it('Should reject requests with no credentials', function(){
            return chai
                .request(app)
                .post('/api/auth/refresh')
                .send({})
                .then(res => {
                    expect(res).to.have.status(401)
                })
        })

        it('Should reject requets with an invalid token', function(){
            const token = jwt.sign({username,firstName,lastName}, 'wrongSecret' ,{ algorithm: 'HS256', expiresIn: '7d'})

            return chai.request(app)
                .post('/api/auth/refresh')
                .set(`Authorization`, `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(401);
                })
        })

        it('Should reject requests with an expired token', function () {
            const token = jwt.sign(
              {
                user: {
                  username,
                  firstName,
                  lastName
                },
                //why here and not in the option parameter?
                exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: username
              }
            );
      
            return chai
              .request(app)
              .post('/api/auth/refresh')
              .set('authorization', `Bearer ${token}`)
              .then(res =>{
                expect(res).to.have.status(401);
              })
          });

          it('Should return a valid auth token with a newer expiry date', function () {
            const token = jwt.sign(
              {
                user: {
                  username,
                  firstName,
                  lastName
                }
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: username,
                expiresIn: '7d'
              }
            );

            const decoded = jwt.decode(token);
            console.log(`token outside the return chai statement is ${JSON.stringify(token)}`)
            console.log(`decoded is ${JSON.stringify(decoded)}`);
      
            return chai
              .request(app)
              .post('/api/auth/refresh')
              .set('Authorization', `Bearer ${token}`)
              .then(res => {
                console.log(`response inside  is ${JSON.stringify(res.body)}`)
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                console.log(`token inside the return chai statement is ${JSON.stringify(token)}`)
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                  algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                  username,
                  firstName,
                  lastName
                });
                expect(payload.exp).to.be.at.least(decoded.exp);
              });
          });
  })
})