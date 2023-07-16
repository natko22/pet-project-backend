const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5005/auth/google",
      redirectUri: process.env.REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("PROFILEID", profile);

      try {
        // Check if the user already exists in  database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // User already exists, return the user
          return done(null, user);
        } else {
          // User doesn't exist, create a new user in  database
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "googlepassword",
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

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
