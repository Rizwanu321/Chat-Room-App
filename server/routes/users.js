const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/room-users/:roomId", userController.getRoomUsers);
router.get("/:username/details", userController.getUserDetails);
router.get("/profile/:username", userController.getUserProfile);

module.exports = router;
