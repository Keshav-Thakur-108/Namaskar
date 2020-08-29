const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", (req, res) => {
  let username = "";

  if (req.isAuthenticated()) {
    switch (req.user.type) {
      case "google":
        username = req.user.google.username;
        break;
      case "github":
        username = req.user.github.username;
        break;
      case "local":
        username = req.user.local.username;
        break;
      default:
        username = null;
    }
  }

  res.render("home", {
    username: username,
    style: "home.css",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
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

router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.user.github.verified
      ? res.redirect("/after_auth")
      : res.redirect(`/${req.user.id}/github/confirm`);
  }
);

router.get("/:id/:provider/confirm", (req, res) => {
  if (req.params.provider == "google") {
    res.render("confirmForm", {
      id: req.params.id,
      provider: req.params.provider,
      style: "confirmForm.css",
      username: req.user.google.username,
    });
  } else if (req.params.provider == "github") {
    res.render("confirmForm", {
      id: req.params.id,
      provider: req.params.provider,
      style: "confirmForm.css",
      username: req.user.github.username,
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
  } else if (req.params.provider == "github") {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: { "github.verified": true, "github.username": req.body.username },
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
