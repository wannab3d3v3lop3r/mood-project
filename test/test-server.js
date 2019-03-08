"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer} = require("../server");
const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Testing", function() {
  
  beforeEach(function(){
    return runServer(config.TEST_DATABASE_URL);
  })

  afterEach(function(){
    return closeServer();
  })

  it("Recieve a 200 status code", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});