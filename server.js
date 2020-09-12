// Constants
const PORT = 3000;

// Requires
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const auth = require('./auth');

(async () => {

  // The Express app
  var app = express();

  // Set up the database connection
  const db = await massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'csportal',
    user: 'csportal_admin',
    password: 'insecure',
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

  // Set up the peer reviews subapp
  app.use(require('./peer-reviews'));

  console.log(db.listTables());

  app.get('/', async (req, res) => {
    res.redirect('/peer-reviews/todo');
  });


  app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

})();
