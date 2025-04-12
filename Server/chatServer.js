import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// In-memory data
const roomUsers = {}; // room => [usernames]
const roomMessages = {}; // room => [{ id, username, message, replyTo, likes: [] }]

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!roomUsers[room]) roomUsers[room] = [];
    if (!roomUsers[room].includes(username)) {
      roomUsers[room].push(username);
    }

    if (!roomMessages[room]) roomMessages[room] = [];

    io.to(room).emit("user-joined", `${username} joined the room`, roomUsers[room]);
  });

  socket.on("send-message", ({ room, username, message, replyTo }) => {
    const msgId = uuidv4();
    const msgData = { id: msgId, username, message, replyTo, likes: [] };

    // Save message
    if (!roomMessages[room]) roomMessages[room] = [];
    roomMessages[room].push(msgData);

    io.to(room).emit("receive-message", msgData);
  });

  socket.on("like-message", ({room, msgId, username}) => {
    console.log(room, msgId ,username)
    const messages = roomMessages[room] || [];
    const msg = messages.find((m) => m.id === msgId);

    if (msg) {
      // Prevent duplicate likes
      if (!msg.likes.includes(username)) {
        msg.likes.push(username);
      } else {
        // Optional: unlike functionality
        msg.likes = msg.likes.filter((user) => user !== username);
      }
      console.log(msg.likes)

      io.to(room).emit("update-likes", { msgId, likes: msg.likes });
    }
  });

  socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("typing-user", username);
  });

  socket.on("leave-room", ({ room, username }) => {
    socket.leave(room);
    if (roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter((user) => user !== username);
    }

    io.to(room).emit("updated-users", username, roomUsers[room]);

     
  });

  socket.on("disconnect", () => {
    const { username, room } = socket;

    if (room && username && roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter((user) => user !== username);
      io.to(room).emit("updated-users", username, roomUsers[room]);
    }

    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
