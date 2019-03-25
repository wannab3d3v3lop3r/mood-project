"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer} = require("../server");
const config = require('../config');
const {Journal} = require('../journalModel');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Testing", function() {

  beforeEach(function(){
    return runServer(config.TEST_DATABASE_URL);
  })

  beforeEach(function(){
    //thinkful way
    return Journal.insertMany([{
      mood: "happy",
      title: "Title",
      thoughts: "thoughts",
      publishDate: Date.now()
    }])
  });

  afterEach(function(){
    return closeServer();
  })

  // it("Recieve a 200 status code", function() {
  //   return chai
  //     .request(app)
  //     .get("/")
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });

  it("Getting /journal-post responds with a journal and getting a status of 200", function() {
    return chai
      .request(app)
      .get("/journal-post")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.eql([{      
          mood: "happy",
          title: "Title",
          thoughts: "thoughts"
        }]);
      });
  });
});