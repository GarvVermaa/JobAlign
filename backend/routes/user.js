const express = require("express");
const router = express.Router();
const User = require("../models/User.js");

router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: `User with this email already exists` });
    }
    user = new User({ name, email });
    await user.save();

    res.status(201).json({
      message: "User Created",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error! " });
  }

});


