document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const form = document.getElementById('chat-form');
  const messageInput = document.getElementById('msg');
  const messages = document.getElementById('messages');
  const imageInput = document.getElementById('imageInput');
  let username = null;

  // Prompt user for username
  while (!username) {
    username = prompt('Enter your username');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (messageInput.value) {
      const message = {
        username,
        text: messageInput.value,
        type: 'text'
      };
      socket.emit('chat message', message);
      messageInput.value = '';
    }
  });

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const message = {
        username,
        text: data.filePath,
        type: 'image'
      };
      socket.emit('image', message);
    });
  });

  socket.on('chat message', (msg) => {
    appendMessage(msg, msg.username === username ? 'outgoingMsg' : 'incomingMsg');
  });

  socket.on('image', (data) => {
    appendImage(data, data.username === username ? 'outgoingMsg' : 'incomingMsg');
  });

  function appendMessage(message, className) {
    const item = document.createElement('div');
    item.className = `message ${className}`;
    item.innerHTML = `
    <div class="message">
    <p style="color: gray; margin:0;padding:0;">${message.username}</p>
    <p style="margin:0;padding:0;">${message.text}</p>
    </div>
    `;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function appendImage(data, className) {
    const item = document.createElement('div');
    item.className = `message ${className}`;
    item.innerHTML = `
    <strong style="margin:0;padding:0;">${data.username}</strong>: <img  style="margin:0;padding:0;" src="${data.text}" alt="Image">
    `;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }
});
