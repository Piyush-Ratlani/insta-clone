const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys.js');
const PORT = process.env.PORT || 5000;

// connecting to DB
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to mongoose');
});
mongoose.connection.on('error', err => {
  console.log('err connecting...', err);
});

// Schema
require('./models/user');
require('./models/post');

// routes
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Listening on PORT:', PORT);
});

// deploying can be done in two ways: 1. build and server files, 2. client and server files (we use 2nd option)

// make PORT dynamic
// if (process.env.NODE_ENV === 'production')
// move keys.js to config
// copy keys.js in prod/dev.js
// server>package.json -> scripts=start,heroku-postbuild
// client>package.json =>dont need to add proxy statement as our react and heroku app will be on same domain, also there will be no cors(cross origin resource sharing) error because our react app and node server are not on different domains otherwise we have to remove proxy and use cors middleware in server>app.js

// create new app in heroku and follow the steps as mentioned below
// delete .git(hidden folder) in client folder

// open terminal in server
// /server>heroku login
// create .gitignore in server folder , because we dont want dev.js(i.e our keys) and node_modules folder to push them {create-react-app automatically creates .gitignore for react app so we dont want to create that for it}
// intialize git : /server>git init
// add(upload) all the files: /server>git add .
// /server>heroku git:remote -a instaclone-3000 (instaclone-3000: is the name of app in heroku)
// /server>git commit -am "make it better"
// /server>git push heroku master

// create environment variables:
// in heroku website under our instaclone app's settings -> reset config vars -> add key values for  MONGOURI,JWT_SEC
