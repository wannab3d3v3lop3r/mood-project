const express = require('express');
const router = express.Router();

const morgan = require('morgan');

//parses the data coming from the client side into the server
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {JournalPosts} = require('./models.js');

//create some data to see
JournalPosts.create('Happiness', 'Today was an interesting day', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');


router.get('/', (req,res) => {
    res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req,res) => {
    const requiredFields = [''];

    

});

router.put('/:id',jsonParser, (req,res) => {
    const requiredFields = [''];

    
    
    const updatedItem = BlogPosts.update({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate,
      id: req.params.id
    });
    res.status(204).end();

});

router.delete('/:id', (req,res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted shopping list item \`${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;