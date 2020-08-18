const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.send("This is the home page");
});

router.get("/register", (req, res) => {
  res.render("register", {
    style: "register.css",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    style: "login.css",
  });
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
