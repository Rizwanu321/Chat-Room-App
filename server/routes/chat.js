const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.get("/:room", chatController.getRoomMessages);

module.exports = router;
