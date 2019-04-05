// "use strict";

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const faker = require('faker');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

// const {startServer, closerServer, app} = require('../server.js');
// const { User } = require('../users/model');

// const expect = chai.expect;
// chai.use(chaiHttp);

// describe('',function(){
//     before(function(){
//         return startServer();
//     })

//     after(function(){
//         return closeServer();
//     })

//     beforeEach(function(){

//     })

//     afterEach(function(){
//         return new Promise((resolve,reject) => {
//             mongoose.connection.dropDatabase()
//                 .then(result => {
//                     resolve(result);
//                 })
//                 .catch(err =>{
//                     reject(err);
//                 })
//         })
//     })

//     it('',function(){

//     })
// })