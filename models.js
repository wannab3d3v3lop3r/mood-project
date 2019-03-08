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