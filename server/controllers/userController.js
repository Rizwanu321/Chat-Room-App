const User = require("../models/User");
const Message = require("../models/Message");

const userController = {
  async getRoomUsers(req, res) {
    try {
      const roomId = req.params.roomId;
      const roomUsers = await User.find({ rooms: roomId }).select(
        "username profilePhoto lastSeen"
      );

      const userList = roomUsers.map((user) => ({
        username: user.username,
        profilePhoto: user.profilePhoto
          ? user.profilePhoto.startsWith("http")
            ? user.profilePhoto
            : `http://localhost:5000${user.profilePhoto}`
          : "/uploads/default-avatar.png",
        lastSeen: user.lastSeen,
      }));

      res.json(userList);
    } catch (err) {
      res.status(500).json({
        message: "Error fetching room users",
        error: err.message,
      });
    }
  },

  async getUserDetails(req, res) {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        username: user.username,
        profilePhoto: user.profilePhoto
          ? user.profilePhoto.startsWith("http")
            ? user.profilePhoto
            : `http://localhost:5000${user.profilePhoto}`
          : "/uploads/default-avatar.png",
        email: user.email,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching user details",
        error: err.message,
      });
    }
  },

  async getUserProfile(req, res) {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: "User not found" });

      const profilePhoto = user.profilePhoto
        ? user.profilePhoto.startsWith("http")
          ? user.profilePhoto
          : `http://localhost:5000${user.profilePhoto}`
        : "/uploads/default-avatar.png";

      res.json({
        username: user.username,
        profilePhoto,
        email: user.email,
        rooms: user.rooms,
        lastSeen: user.lastSeen,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching user profile",
        error: err.message,
      });
    }
  },
};

module.exports = userController;
