const express = require('express');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketio = require('socket.io');

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Connect Databse
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 20, // limit each IP to 10 requests per windowMs
});

//  apply to all requests
app.use(limiter);

io.on('connection', (socket) => {
  socket.on('add post', () => {
    socket.broadcast.emit('post added');
  });

  socket.on('delete post', () => {
    socket.broadcast.emit('post deleted');
  });

  socket.on('like post', (postId) => {
    socket.broadcast.emit('post liked', postId);
  });

  socket.on('unlike post', (postId) => {
    socket.broadcast.emit('post unlike', postId);
  });

  socket.on('add comment', (postId) => {
    socket.broadcast.emit('comment added', postId);
  });

  socket.on('delete comment', (postId) => {
    socket.broadcast.emit('comment deleted', postId);
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'clherient', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
