'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const faker = require('faker');

const { User } = require('../users/model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaihttp);

describe('/api/user',function(){

    let userFakeUserA = createFakerUser();
    let userFakeUserB = createFakerUser();

    before(function(){
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function(){

    })

    afterEach(function(){
        //removes data from the mongodb
        return User.remove({});
        /*

        or

        return new Promise((resolve,reject)){
            mongoose.connection.dropDatabase()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })

            })
        }
        
        */
    })

    after(function(){
        closeServer();
    })

    describe('GET METHOD',function(){
        it('Returns an empty array', function(){
            return chai.request(app)
                .get('/api/user/')
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(0);
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
})
