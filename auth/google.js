const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new googleStrategy(
      {
        clientID:
          "103299283848-k21mnk307c1r97bs750r70caaltbe930.apps.googleusercontent.com",
        clientSecret: "n4Z0d3SMaOe8pzgBP-3q3af5",
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        findOrCreateUser = function () {
          User.findOne(
            { "google.email": profile._json.email },
            (err, foundUser) => {
              console.log(profile._json.email);
              if (err) {
                console.log(err);
                return done(err);
              }

              if (!foundUser) {
                let newUser = new User();
                newUser.google.email = profile._json.email;
                newUser.google.username = profile._json.name;

                newUser.save((err, user) => {
                  if (err) console.log(err);
                  else return done(null, user);
                });
              }

              return done(null, foundUser);
            }
          );
        };
        process.nextTick(findOrCreateUser);
      }
    )
  );
};
