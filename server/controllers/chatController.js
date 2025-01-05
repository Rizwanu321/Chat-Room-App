const Message = require("../models/Message");

const chatController = {
  async getRoomMessages(req, res) {
    try {
      const messages = await Message.find({ room: req.params.room }).sort({
        timestamp: 1,
      });
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  },
};

module.exports = chatController;
