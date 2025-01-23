const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("PROFILEID", profile);

      try {
        // Check if the user already exists in  database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // User already exists, return the user
          console.log("User already exists:", user);
          return done(null, user);
        } else {
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash("googlepassword", salt);
          // User doesn't exist, create a new user in  database
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword,
            isPetOwner: false,
            isSitter: false,
            postalCode: null,
            description: "",
            reviews: [],
            pets: [],
            availability: [],
            bookings: [],
            img: profile.photos[0].value,
          });

          await user.save();
          console.log("New user created", user);
          return done(null, user);
        }
      } catch (error) {
        console.error("Error authenticating with Google:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    const { _id, username, email } = user;

    const payload = { _id, username, email };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    const userWithToken = {
      user,
      authToken,
    };

    done(null, userWithToken);
  } catch (error) {
    done(error, null);
  }
});
