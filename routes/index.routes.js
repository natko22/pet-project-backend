const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const Pet = require("../models/Pet.model");
const Booking = require("../models/Booking.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// get one user by id
router.get("/users/:_id", async (req, res) => {
  const user = await User.findById(req.params._id).populate([
    "reviews",
    "pets",
    "bookings",
  ]);
  res.json(user);
});

// get one pet by id
router.get("/pets/:_id", async (req, res) => {
  const pet = await Pet.findById(req.params._id);
  res.json(pet);
});

// add new pet
router.post("/add-pet", async (req, res) => {
  try {
    const ownerId = req.body.owner;
    delete req.body.owner;
    console.log(ownerId, req.body);
    const newPet = new Pet(req.body);
    console.log(newPet);
    const savedPet = await newPet.save();
    const updatedUser = await User.findByIdAndUpdate(ownerId, {
      $push: { pets: savedPet._id },
    });
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(500).json({ error: "Error adding pet" });
  }
});

// Get all pet profiles
router.get("/pet-profiles", async (req, res) => {
  try {
    const petProfiles = await Pet.find();
    res.json(petProfiles);
    console.log(petProfiles, "PET PROFILES");
  } catch (error) {
    res.status(500).json({ error: "Error fetching pet profiles" });
  }
});

// Search sitters
router.get("/sitters-profiles", async (req, res) => {
  try {
    const sitters = await User.find({ isSitter: true });
    res.json(sitters);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sitters" });
  }
});

// Create a new booking
router.post("/bookings", async (req, res) => {
  try {
    const { sitterId, startDate, endDate, ...formData } = req.body;
    console.log(formData, "formdata");

    if (!sitterId || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBooking = new Booking(req.body);

    const savedBooking = await newBooking.save();

    const updatedUser = await User.findByIdAndUpdate(
      sitterId,
      {
        $push: {
          bookings: savedBooking._id,
          availability: {
            startDate: startDate,
            endDate: endDate,
          },
        },
      },
      { new: true }
    );

    const user = await User.findById(sitterId);
    user.bookings.push(savedBooking._id);
    await user.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the booking" });
  }
});

module.exports = router;
