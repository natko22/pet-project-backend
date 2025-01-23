require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");

const app = express();

// Cookie-session setup
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "default-secret"],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  })
);

app.use(passport.initialize());
app.use(passport.session());

// CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from frontend
    credentials: true, // Allow cookies
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Load middleware
require("./config")(app);

// Routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const petRoutes = require("./routes/pet.routes");
app.use("/api", petRoutes);

// Error handling
require("./error-handling")(app);

module.exports = app;
