const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { registerUser} = require('../controllers/userController')
require('dotenv').config(); 
const { v4: uuidv4 } = require('uuid');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL+'/api/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        User.findByEmail(email, async (err, existingUser) => {
          if (err) {
            console.log("Error Caught")
            return err
          }

          if (existingUser) {
            const token = jwt.sign({ userid: existingUser.userid, email: existingUser.email ,username:existingUser.username,isAdmin:existingUser.isAdmin,profileIcon:existingUser.profileIcon,createdOn:existingUser.createdOn}, process.env.JWT_SECRET, { expiresIn: '1h' });     
            return done(null, { user: existingUser, token });
          } else {
            const newUser = {
              email : email,
              isAdmin:false,
              isGoogleLogin:true,
            };
            User.create(newUser, (err, createdUser) => {
              if (err) return done(err);
              const token = jwt.sign({ userid: createdUser.userid, email: createdUser.email ,username:createdUser.username,isAdmin:createdUser.isAdmin}, process.env.JWT_SECRET, { expiresIn: '1h' });
              return done(null, { user: createdUser, token });
            });
          }
        });
      } catch (error) {
        done(error);
        console.log("Error Caught")
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
