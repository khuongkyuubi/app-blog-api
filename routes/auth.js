const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
// REGISTER
router.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(400).json({ message: "Wrong credentials" });

    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate) return res.status(400).json({ message: "Wrong password!" });
    const { password, ...userInfo } = user["_doc"]; // data in -_doc

    // create jwt
    const accessToken = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      },
      process.env.ACCESS_TOKEN_SECRET || "secret",
      { expiresIn: "3d" }
    );

// send userInfo and accessToken
    return res.status(200).json({ userInfo, accessToken });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
