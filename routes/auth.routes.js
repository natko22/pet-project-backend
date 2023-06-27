const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
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

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password are provided as empty string
    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password." });
    }

    // Check the users collection if a user with the same email exists
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      // If the user is not found, send an error response
      return res.status(401).json({ message: "User not found." });
    }

    // Compare the provided password with the one saved in the database
    const passwordCorrect = await bcrypt.compareSync(
      password,
      foundUser.password
    );

    if (passwordCorrect) {
      // Deconstruct the user object to omit the password
      const { _id, username, email } = foundUser;

      // Create an object that will be set as the token payload
      const payload = { _id, username, email };

      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      // Send the token as the response
      res.status(200).json({ authToken });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify Route  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

// POST "/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});
module.exports = router;
