const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : "";

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePhoto,
      });
      await newUser.save();
      res.json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: "User registration failed" });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  },
};

module.exports = authController;
