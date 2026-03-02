const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const crypto = require("crypto");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google account has no public email"), null);

        let user = await User.findOne({ email });

        if (!user) {
          const derivedUsername =
            profile.displayName?.trim()?.replace(/\s+/g, "") ||
            email.split("@")[0] ||
            `user${Date.now()}`;

          user = await User.create({
            username: derivedUsername,
            email: email,
            password: crypto.randomBytes(32).toString("hex"),
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;