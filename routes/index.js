const express = require("express");
const router = express.Router();
const User = require("../models/user");
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
  req.isAuthenticated()
    ? res.redirect("/")
    : res.render("login", {
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

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.user.google.verified
      ? res.redirect("/after_auth")
      : res.redirect(`/${req.user.id}/google/confirm`);
  }
);

router.get("/:id/:provider/confirm", (req, res) => {
  if (req.params.provider == "google") {
    res.render("confirmForm", {
      id: req.user._id,
      provider: req.params.provider,
      style: "confirmForm.css",
      username: req.user.google.username,
    });
  }
});

router.post("/:id/:provider/confirm", (req, res) => {
  if (req.params.provider == "google") {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: { "google.verified": true, "google.username": req.body.username },
      },
      { new: true },
      (err, user) => {
        if (err) console.log(err);
        else {
          console.log(user);
          res.redirect("/after_auth");
        }
      }
    );
  }
});

router.get("/after_auth", (req, res) => {
  res.render("after_auth");
});

module.exports = router;
