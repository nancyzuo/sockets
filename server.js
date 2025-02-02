const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (for the front-end)
app.use(express.static('public'));

// Handle connections to the server
io.on('connection', (socket) => {
  console.log('a user connected');

  // Join a room
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`a user has joined ${room}`);
    // Emit a message to the room that a user has joined
    io.to(room).emit('chat message', `a new user has joined ${room}`);
  });

  // Listen for chat messages
  socket.on('chat message', (data) => {
    io.to(data.room).emit('chat message', data.message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Set up the server to listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
