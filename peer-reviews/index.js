/** Peer Review Subapp */

// Requires
const express = require('express');
const todo = require('./todo');
const entryForm = require('./entry-form');
const saveResponse = require('./save-response');

// The Express app
var app = express();

// todo route
app.get('/peer-reviews/todo', todo);

app.get('/peer-reviews/complete', entryForm);

app.post('/peer-reviews/complete', saveResponse);

module.exports = app;
