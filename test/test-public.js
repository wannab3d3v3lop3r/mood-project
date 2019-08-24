const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, runServer, closeServer } = require('../server')
const { TEST_DATABASE_URL, JWT_EXPIRY, JWT_SECRET } = require('../config');
const expect = chai.expect;

describe('public files are on the page',function(){
    before(function(){
        return runServer(TEST_DATABASE_URL)
    })

    beforeEach(function(){

    })

    afterEach(function(){

    })

    after(function(){
        closeServer();
    })

    it('dashboard html renders',function(){
        return chai.request(app)
            .get('/dashboard/dashboard.html')
            .then(res => {
                expect(res).to.have.status(200)
            })
    })

    it('create post html renders', function(){
        return chai.request(app)
            .get('/dashboard/create.post.html')
            .then(res => {
                expect(res).to.have.status(200)
            })
    })

    it('details html renders', function(){
        return chai.request(app)
            .get('/dashboard/details.html')
            .then(res => {
                expect(res).to.have.status(200)
            })
    })
})