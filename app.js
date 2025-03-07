// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const { isAuthenticated } = require("./middleware/jwt.middleware");
const app = express();
// google -login
const passportSetup = require("./middleware/passport");
const passport = require("passport");
const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["pet-project"],
    maxAge: 24 * 60 * 60 * 100,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? "https://pet-project-backend-bxma.onrender.com"
          : "localhost",
    },
    // domain: process.env.BACKEND_URL,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
const cors = require("cors");
// Remove the existing cors configuration and replace with:
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://petopia-petopia.netlify.app"
        : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const petRoutes = require("./routes/pet.routes");
const cookieParser = require("cookie-parser");
app.use("/api", petRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
