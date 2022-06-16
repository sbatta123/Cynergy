/* eslint-disable no-console */

module.exports = (db, io) => {
  // Whenever someone connects this gets executed
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
