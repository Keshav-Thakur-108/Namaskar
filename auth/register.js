const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        findOrCreateUser = function () {
          User.findOne({ "local.email": req.body.email }, (err, user) => {
            if (err) {
              console.log(err);
              return done(err);
            }

            if (user) {
              console.log("Username already exists");
              return done(null, false);
            }

            if (password != req.body.confirmPassword) {
              console.log("Password does not match the confirmed password");
              return done(null, false);
            } else {
              var newUser = new User();
              newUser.local.email = req.body.email;
              newUser.local.username = req.body.username;
              newUser.local.password = encrypt(req.body.password);
              newUser.type = "local";

              newUser.save((err) => {
                if (err) {
                  console.log(err);
                  return done(err, false);
                } else return done(null, newUser);
              });
            }
          });
        };
        process.nextTick(findOrCreateUser);
      }
    )
  );
};

const encrypt = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
