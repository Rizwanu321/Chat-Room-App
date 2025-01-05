const User = require("../models/User");

const userRooms = {};
const userSockets = {};
const onlineUsers = new Set();

async function addUserToRoom(username, room, socketId) {
  try {
    if (!userRooms[room]) {
      userRooms[room] = [];
    }

    const user = await User.findOne({ username });
    if (!user) return null;

    const existingUserIndex = userRooms[room].findIndex(
      (u) => u.username === username
    );
    if (existingUserIndex !== -1) {
      userRooms[room].splice(existingUserIndex, 1);
    }

    const userDetails = {
      username: user.username,
      socketId: socketId,
      profilePhoto: user.profilePhoto || "/uploads/default-avatar.png",
    };

    userRooms[room].push(userDetails);
    userSockets[username] = socketId;

    await User.findOneAndUpdate(
      { username },
      { $addToSet: { rooms: room } },
      { new: true }
    );

    return userDetails;
  } catch (error) {
    console.error("Error adding user to room:", error);
    return null;
  }
}

function removeUserFromRoom(socketId) {
  for (const room in userRooms) {
    const index = userRooms[room].findIndex(
      (user) => user.socketId === socketId
    );
    if (index !== -1) {
      const user = userRooms[room].splice(index, 1)[0];
      delete userSockets[user.username];
      return { username: user.username, room };
    }
  }
  return {};
}

function getUsersInRoom(room) {
  return userRooms[room] || [];
}

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  userSockets,
  onlineUsers,
};
