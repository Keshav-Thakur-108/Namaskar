const user = require("../models/user");

const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    "login",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      function (req, email, password, done) {
        User.findOne({ "local.email": email }, (err, user) => {
          if (err) {
            console.log(err);
            return done(err);
          }

          if (!user) {
            console.log("Username does not exist");
            return done(null, false);
          }

          if (!isValidPassword(password, user.local.password)) {
            console.log("Incorrect Password entered");
            return done(null, false);
          }

          return done(null, user);
        });
      }
    )
  );
};

function isValidPassword(enteredPassword, password) {
  return bcrypt.compareSync(enteredPassword, password);
}
