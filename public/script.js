const socket = io();
const joinRoomButton = document.getElementById('join-room');
const roomNameInput = document.getElementById('room-name');
const roomTitle = document.getElementById('room-title');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');

// Listen for messages from the server
socket.on('chat message', (msg) => {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = msg;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
});

// Join a chat room
joinRoomButton.addEventListener('click', () => {
  const roomName = roomNameInput.value.trim();
  if (roomName) {
    roomTitle.textContent = ` ${roomName}`;
    // Hide the room form and show the chat interface
    document.getElementById('room-form').style.display = 'none';
    chatContainer.style.display = 'block';

    // Emit a 'join room' event
    socket.emit('join room', roomName);
  }
});

// Send a message to the chat room
sendMessageButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  const roomName = roomNameInput.value.trim(); // Get the room name

  if (message) {
    // Emit the message to the server
    socket.emit('chat message', { room: roomName, message });

    // Display the message in the local chat box (for the sender)
    const messageDiv = document.createElement('div');
    // messageDiv.textContent = `You: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom

    // Clear the message input
    messageInput.value = '';
  }
});

// Listen for Enter key press
messageInput.addEventListener('keydown', (event) => {
  // Check if the pressed key is Enter (keyCode 13 or key == "Enter")
  if (event.key === "Enter") {
    // Prevent the default behavior of adding a new line in the textarea
    event.preventDefault();

    const message = messageInput.value.trim();
    if (message) {
      // Emit the message to the server
      socket.emit('chat message', { room: 'someRoom', message });

      // Display the message locally in the chat box
      const messageDiv = document.createElement('div');
      messageDiv.textContent = `${message}`;
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom

      // Clear the input field after sending
      messageInput.value = '';
    }
  }
});
