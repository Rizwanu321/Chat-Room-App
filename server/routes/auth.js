const express = require("express");
const multer = require("multer");
const path = require("path");
const authController = require("../controllers/authController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/register",
  upload.single("profilePhoto"),
  authController.register
);
router.post("/login", authController.login);

module.exports = router;
