import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { connectDb } from './config/db.js';
import { userRoutes } from './routes/userRoutes.js';
import { chatRoutes } from './routes/chatRoutes.js';
import { messageRoutes } from './routes/messageRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Create HTTP server
const httpServer = createServer(app);

// Initialize socket.io
const io = new SocketIOServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket Events
io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🚪 Client disconnected:', socket.id);
  });
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    // console.log(userData._id)
    socket.emit("connected")
  })

  socket.on("join-room", (room) => {
    // other person k ei room e add korbo
    socket.join(room);
    console.log("user joind to = ", room);
  })

  socket.on("new-message", (newMessage) => {
    // ei msg gula k upore join hoa room e pathabo
    let chat = newMessage?.message?.chat;
    // console.log(newMessage)
    // console.log(chat?.users)

    if(!chat?.users) return console.log("chat.users not defind")

      // group chat hoile ami bad e baki sobai k msg ta pathabo
      chat.users.forEach(user => {
        //jodi user ta ami hoi taile r kichi korbo na
        if(user._id == newMessage?.message?.sender._id) return;

        //other wise baki der k pathabo
        // console.log("i am found")
        socket.in(user._id).emit('message-recieved', newMessage);
      })
  })

  //typing animation er jonno
  socket.on('typing', (room) => socket.in(room).emit("typing"))
  socket.on('stop-typing', (room) => socket.in(room).emit("stop-typing"))

  socket.off("setup", (user) => {
    socket.leave(user?._id)
  })
});

// Start the server
httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
