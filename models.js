const uuid = require('uuid');

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const JounralPosts = {  
  create: function(mood, title, thoughts) {
    const post = {
      id: uuid.v4(),
      mood: mood,
      title: title,
      thoughts: thoughts,
      publishDate: Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id) {
  },
  delete: function(id) {

  },
  update: function(updatedPost) {

  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}


module.exports = {JounralPosts: createJournalPostsModel()};