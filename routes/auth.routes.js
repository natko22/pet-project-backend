const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
const passport = require("passport");
const passportSetup = require("../middleware/passport");
const CLIENT_URL = "http://localhost:3000";
// Sign Up Route - Creates a new User in the DB
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, isPetOwner, isSitter, postalCode } =
      req.body;

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
      postalCode,
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

// auth with google

router.get("/login/failed", (req, res) => {
  console.log("Login failed");
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    const { _id, username, email } = req.user;
    // Create the token payload
    const payload = { _id, username, email };

    // Generate the token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    console.log("Login successful. User:", req.user);
    res.status(200).json({
      authToken,
      success: true,
      message: "Successful",
      user: req.user,
    });
  } else {
    console.log("User not authenticated");
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback route for google to redirect to
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { _id, username, email } = req.user;
    const payload = { _id, username, email };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    console.log("AUTH-TOKEN", authToken);
    res.redirect(`${CLIENT_URL}/profile/${_id}?token=${authToken}`);
  }
);

// get userId
router.get("/edit/:_id", async (req, res) => {
  try {
    const userId = req.params._id;
    // console.log(req.payload);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// update users's profile
router.put("/edit/:_id", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const updatedProfile = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedProfile, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST "/upload/:userId" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post(
  "/upload/:userId",
  fileUploader.single("imageUrl"),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      console.log(userId);

      if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
      }

      // Update the user's image URL in the database
      const updateUserImage = await User.findByIdAndUpdate(
        userId,
        { img: req.file.path },
        { new: true }
      );

      // Get the URL of the uploaded file and send it as a response
      res.json({ fileUrl: req.file.path });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
