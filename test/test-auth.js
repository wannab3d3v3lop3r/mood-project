// "use strict";

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const faker = require('faker');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

// const { runServer, closeServer, app} = require('../server.js');
// const { User } = require('../users/model');

// const expect = chai.expect;
// chai.use(chaiHttp);

// describe('Auth endpoints',function(){
//     before(function(){
//         return runServer();
//     })

//     after(function(){
//         return closeServer();
//     })

//     beforeEach(function(){
//         let fakeUser = createFakerUser();

//         return User
//             .hashPassword(fakeUser.password)
//             .then(password => {
//                 User.create({
//                     username: fakeUser.username,
//                     password: password,
//                     firstName: fakeUser.firstName,
//                     lastName: fakeUser.lastName
//                 })
//             });
//     })

//     afterEach(function(){
//         return new Promise((resolve,reject) => {
//             mongoose.connection.dropDatabase()
//                 .then(result => {
//                     resolve(result);
//                 })
//                 .catch(err =>{
//                     reject(err);
//                     console.error(err);
//                 })
//         })
//     })

//     describe('/api/auth/login',function(){
//         let fakeUser = createFakerUser();

//         it('Should reject requests with no credentials', function(){
//             return chai
//                 .request(app)
//                 .post('/api/auth/login')
//                 .then(() => {
//                     expect.fail(null, null, 'Request should not succeed')
//                 })
//                 .catch(err => {
//                     if (err instanceof chai.AssertionError) {
//                         throw err;
//                       }
            
//                       const res = err.response;
//                       expect(res).to.have.status(400);
//                 })
//         })


//     })
// })

// function createFakerUser(){
//     return {
//             firstName: `${faker.name.firstName()}`,
//             lastName: `${faker.name.lastName()}`,
//             username: `${faker.internet.userName()}`,
//             password: `${faker.internet.password()}`
//         }
// }