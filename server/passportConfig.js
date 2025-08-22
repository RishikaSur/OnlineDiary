import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getUserByGoogleId, createUserWithGoogle, getUserById } from './utils/userUtils.js';

/*
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return done(null, false); // No crash, just "no user"
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});*/


// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await getUserByGoogleId(profile.id);
    if (!user) {
      // Create new user
      user = await createUserWithGoogle(profile);
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
