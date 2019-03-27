"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');

const {TEST_DATABASE_URL, PROD_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require("../server");
const {Journal} = require('../journal/model');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Testing", function() {

  before(function(){
    return runServer(PROD_DATABASE_URL);
  });

  after (function (){
    return closeServer();
  });

  it("Getting /journal-post responds with a journal and getting a status of 200", function() {
    return chai
      .request(app)
      .get("/api/journal-post/")
      .then(function(res) {
        expect(res).to.have.status(200);
      })
  })
});