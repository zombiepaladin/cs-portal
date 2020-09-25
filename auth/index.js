/** CAS authentication express subapp */

// Requires
const https = require('https');
const express = require('express');
const process = require('process');
const {findOrCreateUser} = require('./user-functions');

// The serviceHost (our server) and casHost (the CAS server)
// hostnames, we nee to build urls.  Since we pass our serviceHost
// as a url component in the search string, we need to url-encode it.
var serviceHost = encodeURIComponent(process.env.AUTH_SERVICE_HOST);
var casHost = process.env.AUTH_CAS_HOST;

// The Express subapp
var app = express();

// login route
app.get('/auth/login', login);

// logout route
app.get('/auth/logout', logout);

// ticket confirmation
app.get('/auth/ticket', ticket);

// login required middleware
app.loginRequired = (req, res, next) => {
  console.log(req.url);
  // Allow routes starting with /auth/ through
  if(/$\/auth\//.test(req.url)) return next();
  // If no user is set on the session, redirect to the login url
  if(!req.session.user) {console.log('no user'); res.redirect('/auth/login');}
  // Otherwise, allow the request to move forward
  else {console.log("in"); next();}
};

module.exports = app;

/** @function login
 * Attempts logging in by redirecting to the CAS server
 * @param {http.IncomingRequest} req - the request object
 * @param {http.ServerResponse} res - the response object
 */
function login(req, res) {
  // CAS authentication begins by redirecting to our CAS server
  res.statusCode = 302;
  res.setHeader("Location", casHost + "/login?service=" + serviceHost + "ticket");
  res.end();
}

/** @function logout
  * Logs the user out of the CAS service
  * @param {http.IncomingRequest} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function logout(req, res) {
  res.statusCode = 302;
  res.setHeader("Location", casHost + "/logout");
  res.end();
}

/** @function ticket
  * Verifies a recieved ticket
  * @param {http.IncomingRequest} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function ticket(req, res) {
  // get the ticket from the querystring
  var ticket = req.query.ticket;
  // We need to verify this ticket with the CAS server,
  // by making a request against its serviceValidate url
  var url = casHost + 'serviceValidate?ticket=' + ticket + '&service=' + serviceHost + "ticket";
  https.get(url, function(response){
    var body = "";
    // The request body will come in chunks; we
    // must collect it
    response.on('data', function(chunk){
      body += chunk;
    });
    // Once it's collected, we want to see if
    // it contains a success or failure message
    response.on('end', function(){
      console.log(body);
      // The contents are XML, and we can look
      // for a <cas:user>username</cas:user>
      // element if our user logged in successfully
      var match = /<cas:user>(\S+)<\/cas:user>/.exec(body);
      if(match) {
        // if we have a match, the user logged in through CAS;
        // Find the user and create a session
        var eid = match[1];
console.log('eid:', eid);
console.log(match);
        var db = req.app.get('db');
        findOrCreateUser(db, eid).then(user => {
console.log("user:", user);
          req.session.user = user;
          res.redirect('/');
        }).catch(err => {
          console.error(err);
          res.statusCode = 500;
          res.end("Server Error");
        });

      } else {
        // If there is no match, the CAS server rejected
        // the token.
        res.statusCode = 403;
        res.end("Unauthorized");
      }
    });
  }).on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end();
  });
}