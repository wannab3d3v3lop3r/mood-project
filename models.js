
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

const JournalPosts = {  
  create: function(mood, title, thoughts) {
    const post = {
      mood: mood,
      title: title,
      thoughts: thoughts,
      publishDate: Date.now()
    };
  },
  get: function(id) {
  },
  delete: function(id) {
  },
  update: function(updatedPost) {
  }
};

function createJournalPostsModel() {
  const storage = Object.create(JournalPosts);
  storage.posts = [];
  return storage;
}


module.exports = {JounralPosts: createJournalPostsModel()};