/* eslint-disable import/order */
// Create express app
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const config = require('./db-config');
const lib = require('./dbOperations');
const setupAPIs = require('./apis');
const setupSockets = require('./sockets');

const webapp = express();

webapp.use(session({ secret: 'supersecret' }));

// declare the database object
let db;

webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

webapp.use(cors({ credentials: true, origin: true }));

// Start server
const port = process.env.PORT || 10000;

const http = require('http').Server(webapp);
const io = require('socket.io')(http, { cors: { origin: '*' } });

http.listen(port, async () => {
  db = await lib.connect(config.url);
  setupAPIs(db, io, webapp);
  setupSockets(db, io);

  // eslint-disable-next-line no-console
  console.log(`Server running on port:${port}`);
});

// webapp.listen(port, async () => {
//   db = await lib.connect(config.url);
//   // eslint-disable-next-line no-console
//   console.log(`Server running on port:${port}`);
// });

module.exports = webapp;
