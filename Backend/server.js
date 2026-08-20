const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ==========================
// Socket.IO
// ==========================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ==========================
// Online Users
// // ==========================

const onlineUsers = {};
const userSockets = {};

// io ko routes me use karne ke liye
app.set("io", io);

// ==========================
// Middlewares
// ==========================

app.use(cors());
app.use(express.json());

// Image Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// Routes
// ==========================

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ==========================
// MongoDB
// ==========================

mongoose
  .connect("mongodb://127.0.0.1:27017/chatApp")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// ==========================
// Test Route
// ==========================

app.get("/", (req, res) => {
  res.send("Chat Server Running");
});

// ==========================
// Socket Connection
// ==========================

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("userOnline", (userName) => {
    onlineUsers[userName] = socket.id;
    userSockets[socket.id] = userName;

    io.emit("onlineUsers", Object.keys(onlineUsers));

    console.log("Online Users:", Object.keys(onlineUsers));
  });
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });
  socket.on("userTyping", ({ sender, receiver }) => {
    console.log("Typing event:", sender, "→", receiver);
    const receiverSocketId = onlineUsers[receiver];

    if (receiverSocketId) {
      console.log("Sending typing to:", receiverSocketId);

      io.to(receiverSocketId).emit("userTyping", {
        sender: sender,
        receiver: receiver,
      });
    }
  });

  socket.on("userStoppedTyping", ({ receiver }) => {
    const receiverSocketId = onlineUsers[receiver];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping");
    }
  });

  socket.on("disconnect", () => {
    for (let user in onlineUsers) {
      if (onlineUsers[user] === socket.id) {
        delete onlineUsers[user];
      }
    }

    io.emit("onlineUsers", Object.keys(onlineUsers));

    console.log("User Disconnected:", socket.id);
  });
});

// ==========================
// Server
// ==========================

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});