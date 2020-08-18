const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  req.session ? console.log(req.session.passport.user) : null;
  res.send("This is the home page");
});

router.get("/register", (req, res) => {
  res.send("This is the register page");
});

router.get("/login", (req, res) => {
  res.send("This is the login page");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/register",
    successRedirect: "/",
  })
);

module.exports = router;
