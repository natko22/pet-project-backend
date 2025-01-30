const mongoose = require("mongoose");
require("dotenv").config();

// Define MongoDB URI based on environment
const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI // Railway MongoDB in production
    : "mongodb://127.0.0.1:27017/pet-project-backend"; // Local MongoDB in development

console.log("MongoDB Environment:", process.env.NODE_ENV);
console.log("Connecting to MongoDB at:", MONGO_URI);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then((x) => {
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Detailed error connecting to mongo:", err);
    console.log("Connection string used:", MONGO_URI);
    console.log("MongoDB connection state:", mongoose.connection.readyState);
  });
