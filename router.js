const express = require('express');
const router = express.Router();

const morgan = require('morgan');

//parses the data coming from the client side into the server
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {JournalPosts} = require('./models.js');

router.get('/', (req,res) => {
})

router.post('/', jsonParser, (req,res) => {

});

router.put('/:id',jsonParser, (req,res) => {
});

router.delete('/:id', (req,res) => {
});

module.exports = router;