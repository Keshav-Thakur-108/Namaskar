const passport = require("passport");
const githubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new githubStrategy(
      {
        clientID: "fd4917ca75b0172ee3b1",
        clientSecret: "10a8ca65dddea8c37519510232d8a8e4eab66dc1",
        callbackURL: "http://localhost:3000/auth/github/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        findOrCreateUser = function () {
          console.log(profile);
          User.findOne(
            { "github.url": profile._json.html_url },
            (err, foundUser) => {
              console.log(profile._json.email);
              if (err) {
                console.log(err);
                return done(err);
              }

              if (!foundUser) {
                let newUser = new User();
                newUser.github.url = profile._json.html_url;
                newUser.github.username = profile._json.login;
                newUser.type = "github";

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
