const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const {
  handleJoinRoom,
  handleSendMessage,
  handlePrivateMessage,
  handleDisconnect,
  handleUserOnline,
  handleUserOffline,
  handleTyping,
  handleLeaveRoom,
} = require("./utils/socketHandlers");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/users");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

const io = new Server(server, {
  cors: corsOptions,
  maxHttpBufferSize: 1e8,
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (data) => handleJoinRoom(io, socket, data));
  socket.on("sendMessage", (data) => handleSendMessage(io, data));
  socket.on("privateMessage", (data) => handlePrivateMessage(io, socket, data));
  socket.on("userOnline", (username) => handleUserOnline(io, username));
  socket.on("userOffline", (username) => handleUserOffline(io, username));
  socket.on("typing", (data) => handleTyping(socket, data));
  socket.on("leaveRoom", (data) => handleLeaveRoom(io, socket, data));
  socket.on("disconnect", () => handleDisconnect(io, socket));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = server;
