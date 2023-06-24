const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;
const User = "../models/User.model.js";

// Sign Up Route - Creates a new User in the DB

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, isPetOwner, isSitter } = req.body;

    // Check if username,email and password are provided as empty string
    if (username === "" || email === "" || password === "") {
      res.status(400).json({ message: "Provide username,email and password" });
      return;
    }

    // Using  regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }
    // Using regex to validate the password format

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    // Checking  if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // If email is unique, proceed to hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isPetOwner,
      isSitter,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});
