const express = require('express');
const app = express();

/*      line activates static asset sharing and allows us to server HTML, CSS, image, etc. 
files from a public folder hosted on the same server as our app.        */

app.use(express.static('public'));

app.listen(process.env.PORT || 8080);