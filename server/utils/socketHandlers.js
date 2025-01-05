const Message = require("../models/Message");
const User = require("../models/User");
const {
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  userSockets,
  onlineUsers,
} = require("./socketStore");

async function handleJoinRoom(io, socket, { username, room }) {
  try {
    const user = await User.findOne({ username });
    if (user) {
      await user.joinRoom(room);
    }

    socket.join(room);
    const userDetails = await addUserToRoom(username, room, socket.id);

    if (!userDetails) {
      console.error(`User ${username} not found`);
      return;
    }

    const previousMessages = await Message.find({
      $or: [
        { room: room, private: false },
        { private: true, recipient: username },
        { private: true, sender: username },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    socket.emit("previousMessages", previousMessages);

    const usersInRoom = await User.find({
      rooms: room,
      username: { $ne: username },
    });

    const formattedUsers = usersInRoom.map((user) => ({
      username: user.username,
      profilePhoto: user.profilePhoto.startsWith("http")
        ? user.profilePhoto
        : `http://localhost:5000${user.profilePhoto}`,
      socketId: userSockets[user.username] || null,
    }));

    io.to(room).emit("usersInRoom", formattedUsers);
    socket.emit("usersInRoom", formattedUsers);

    socket.to(room).emit("userJoined", {
      username: user.username,
      profilePhoto: user.profilePhoto.startsWith("http")
        ? user.profilePhoto
        : `http://localhost:5000${user.profilePhoto}`,
      socketId: socket.id,
    });

    onlineUsers.add(username);
    io.emit("onlineUsersList", Array.from(onlineUsers));
  } catch (err) {
    console.error("Room joining error:", err);
  }
}

async function handleSendMessage(io, { room, sender, text }) {
  try {
    const message = await Message.create({
      sender,
      text,
      room,
      private: false,
    });
    io.to(room).emit("message", message);
  } catch (err) {
    console.error("Send message error:", err);
  }
}

async function handlePrivateMessage(io, socket, { sender, recipient, text }) {
  try {
    const message = await Message.create({
      sender,
      recipient,
      text,
      private: true,
    });

    const recipientSocketId = userSockets[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("privateMessage", message);
    }

    io.to(socket.id).emit("privateMessage", message);
  } catch (err) {
    console.error("Private message error:", err);
  }
}

function handleTyping(socket, { username, room, isTyping }) {
  socket.to(room).emit("typing", { username, isTyping });
}

function handleUserOnline(io, username) {
  onlineUsers.add(username);
  io.emit("onlineUsersList", Array.from(onlineUsers));
}

function handleUserOffline(io, username) {
  onlineUsers.delete(username);
  io.emit("onlineUsersList", Array.from(onlineUsers));
}

async function handleLeaveRoom(io, socket, { username, room }) {
  try {
    const user = await User.findOne({ username });
    if (user) {
      socket.leave(room);
      removeUserFromRoom(socket.id);
      socket.to(room).emit("userLeft", { username });
      onlineUsers.delete(username);
      io.emit("onlineUsersList", Array.from(onlineUsers));
    }
  } catch (err) {
    console.error("Room leaving error:", err);
  }
}

async function handleDisconnect(io, socket) {
  const { username, room } = removeUserFromRoom(socket.id);
  if (username && room) {
    io.to(room).emit("userLeft", { username });
    onlineUsers.delete(username);
    io.emit("onlineUsersList", Array.from(onlineUsers));
  }
}

module.exports = {
  handleJoinRoom,
  handleSendMessage,
  handlePrivateMessage,
  handleTyping,
  handleUserOnline,
  handleUserOffline,
  handleLeaveRoom,
  handleDisconnect,
};
