const express = require("express");
const router = express.Router();
const photoUploader = require("../config/cloudinary.config");

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", photoUploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  console.log("Uploaded file path:", req.file.path);

  res.json({ photoUrl: req.file.path });
});

module.exports = router;
