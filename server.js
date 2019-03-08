const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const journalPostRouter = require('./router');
const morgan = require('morgan');

const app = express();
app.use(express.json());

// log the http layer
app.use(morgan("common"));

/*      line activates static asset sharing and allows us to server HTML, CSS, image, etc. 
files from a public folder hosted on the same server as our app.        */
app.use(express.static('public'));

app.use('journal-post', journalPostRouter);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

function runServer(databaseUrl = config.DATABASE_URL, port=process.env.PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });

}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// `closeServer` function is here in original code

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.

// When we open this file in order to import app and runServer in a test module, we don't want the server to automatically run,
// and this conditional block makes that possible.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};