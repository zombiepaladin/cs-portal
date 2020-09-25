// Load .env file into environment
require('dotenv').config();

// Requires
const process = require('process');
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const auth = require('./auth');

// Constants
const PORT = process.env.PORT;

(async () => {

  // The Express app
  var app = express();

  // Set up the database connection
  const db = await massive({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    scripts: '/database/queries'
  });
  app.set('db', db);

  // Set up the sessions
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  // Set up authentication - all routes require auth
  // except the auth routes
  app.use(auth);
  app.use(auth.loginRequired);
  
  // Set up any subapps!
  //app.use(require('./peer-reviews'));

  console.log(db.listTables());

  app.get('/', async (req, res) => {
    res.send("Welcome!")
  });


  app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

})();
