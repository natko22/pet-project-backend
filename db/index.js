const mongoose = require("mongoose");
require("dotenv").config();

// Define MongoDB URI based on environment
const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI // Atlas MongoDB in production
    : "mongodb://127.0.0.1:27017/pet-project-backend"; // Local MongoDB in development

// Add more detailed logging to help troubleshoot connection issues
console.log("MongoDB Environment:", process.env.NODE_ENV);
// Log sanitized URI to avoid exposing credentials
const sanitizedUri = MONGO_URI?.includes("@")
  ? MONGO_URI.replace(/:([^@]+)@/, ":****@")
  : MONGO_URI;
console.log("Attempting MongoDB connection at:", sanitizedUri);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
    // Add these new options for better Atlas connectivity
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    // Add heartbeat monitoring
    heartbeatFrequencyMS: 10000,
    autoIndex: true,
  })
  .then((x) => {
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    // Add event listeners for connection issues
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Attempting to reconnect...");
    });
  })
  .catch((err) => {
    console.error("Detailed error connecting to mongo:", err);
    // Log the specific error code and message for better debugging
    if (err.name === "MongoServerError") {
      console.error("MongoDB Server Error Code:", err.code);
      console.error("MongoDB Server Error Message:", err.errmsg);
    }
    console.log("Connection string used:", sanitizedUri);
    console.log("MongoDB connection state:", mongoose.connection.readyState);
  });
