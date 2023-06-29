const express = require("express");
const Pet = require("../models/Pet.model");

// get pet
router.get("/pets/:_id", async (req, res) => {
  try {
    const petId = req.params._id;
    // console.log(req.payload);
    const pet = await Pet.findById(userId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// update pets's profile
router.put("/pet/:_id", isAuthenticated, async (req, res, next) => {
  try {
    const petId = req.payload._id;
    const updatedPetProfile = req.body;

    const user = await Pet.findByIdAndUpdate(petId, updatedPetProfile, {
      new: true,
    });

    if (!Pet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    res.json(Pet);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
