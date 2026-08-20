const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register API
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    res.json({
      message: "User Registered Successfully",
      user: newUser
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

// Login API
router.post("/login", async (req, res) => {
  try {

    console.log("Login Request:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    res.json({
      message: "Login Successful",
      user
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;