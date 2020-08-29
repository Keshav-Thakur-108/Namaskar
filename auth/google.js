const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new googleStrategy(
      {
        clientID:
          "480676129224-ddsd1n1t2apjpphma58petpvqrg366uu.apps.googleusercontent.com",
        clientSecret: "uUJZhUx0E9I5Hr8kA-jbjwjV",
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
                newUser.type = "google";

                newUser.save((err, user) => {
                  if (err) console.log(err);
                  else return done(null, user);
                });
              } else return done(null, foundUser);
            }
          );
        };
        process.nextTick(findOrCreateUser);
      }
    )
  );
};
