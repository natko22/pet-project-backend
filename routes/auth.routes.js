const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;
const User = require("../models/User.model");

// Sign Up Route - Creates a new User in the DB
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, isPetOwner, isSitter } = req.body;

    // Check if username, email, and password are provided as empty string
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Provide username, email, and password" });
    }

    // Check if isPetOwner and isSitter are provided
    if (isPetOwner === undefined || isSitter === undefined) {
      return res
        .status(400)
        .json({ message: "Provide isPetOwner and isSitter values" });
    }

    // Using regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Provide a valid email address" });
    }

    // Using regex to validate the password format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase, and one uppercase letter",
      });
    }

    // Checking if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // If email is unique, proceed to hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isPetOwner,
      isSitter,
    });

    console.log(newUser);
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
