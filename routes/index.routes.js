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

// Add or remove user from favorites
router.put("/favorites/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { userIdToAdd, userIdToRemove } = req.body;

    let updatedUser;

    if (userIdToAdd) {
      // Add user to favorites
      updatedUser = await User.findByIdAndUpdate(
        userIdToAdd,
        { $push: { favorites: userId } },
        { new: true }
      );
    } else if (userIdToRemove) {
      // Remove user from favorites
      updatedUser = await User.findByIdAndUpdate(
        userIdToRemove,
        { $pull: { favorites: userId } },
        { new: true }
      );
    }

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users in favorites
router.get("/favorites/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const favorites = await User.find({ _id: { $in: user.favorites } });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Error fetching favorites" });
  }
});

// Search sitters
router.get("/sitters-profiles", async (req, res) => {
  try {
    const { postalCode } = req.query;

    let query = { isSitter: true };
    if (postalCode) {
      query.postalCode = postalCode;
    }

    const sitters = await User.find(query);
    res.json(sitters);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sitters" });
  }
});

// Create a new booking
router.post("/bookings", async (req, res) => {
  try {
    const { ownerId, sitterId, startDate, endDate, ...formData } = req.body;
    console.log(formData, "formdata");

    if (!sitterId || !startDate || !endDate || !ownerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBooking = new Booking(req.body);

    const savedBooking = await newBooking.save();

    const updatedUser = await User.findByIdAndUpdate(
      sitterId,
      {
        $push: {
          bookings: savedBooking._id,
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the booking" });
  }
});

//set available date
router.post("/availableDates", async (req, res) => {
  try {
    const { userId, startDate, endDate, ...formData } = req.body;
    console.log(formData, "formdata");

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          availability: { startDate, endDate },
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json(updatedUser);
  } catch (error) {
    console.error("Error creating available dates:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating available dates" });
  }
});

// Remove available date
router.delete("/availableDates/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const updatedUser = await User.findOneAndUpdate(
      { availability: { $elemMatch: { _id: bookingId } } },
      { $pull: { availability: { _id: bookingId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error removing available date:", error);
    res.status(500).json({ error: "An error occurred while removing the available date" });
  }
});

// add new review
router.post("/add-review", async (req, res) => {
  try {
    const ownerId = req.body.owner;
    delete req.body.owner;
    console.log(ownerId, req.body);
    const newReview = new Review(req.body);
    console.log(newReview);
    const savedReview = await newReview.save();
    const updatedUser = await User.findByIdAndUpdate(ownerId, {
      $push: { reviews: savedReview._id },
    });
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: "Error adding pet" });
  }
});

module.exports = router;
