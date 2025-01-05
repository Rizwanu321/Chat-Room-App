const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    recipient: { type: String },
    text: { type: String, required: true },
    avatar: { type: String },
    room: { type: String },
    private: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
