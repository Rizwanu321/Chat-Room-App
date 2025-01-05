const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: String,
    password: String,
    profilePhoto: String,
    rooms: [{ type: String }],
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.methods.joinRoom = function (roomId) {
  if (!this.rooms.includes(roomId)) {
    this.rooms.push(roomId);
    return this.save();
  }
};

userSchema.methods.leaveRoom = function (roomId) {
  this.rooms = this.rooms.filter((room) => room !== roomId);
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
