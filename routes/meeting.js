const express = require("express");
const Meeting = require("../models/meeting");
const router = express.Router();
const rand = require("rand-token");

router.get("/create", (req, res) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  else {
    const room = rand.uid(8);
    const password = rand.generate(8);

    const newMeeting = new Meeting();
    newMeeting._id = room;
    newMeeting.password = password;
    newMeeting.host = req.user._id;
    newMeeting.participants.push(req.user._id);

    newMeeting.save((err) => {
      if (err) console.log(err);
      else res.redirect(`/${room}/call`);
    });
  }
});

router.get("/joinMeeting", (req, res) => {
  res.render("joinMeeting", {
    style: "passForm.css",
  });
});

router.get("/:roomId/joinMeeting", (req, res) => {
  res.render("passForm", {
    style: "passForm.css",
    roomId: req.params.roomId,
  });
});

router.post("/:id/joinMeeting/call", (req, res) => {
  Meeting.findOne({ _id: req.params.id }, (err, meeting) => {
    if (err) {
      console.log(err);
      res.redirect(`/${req.params.id}/joinMeeting`);
    } else if (!meeting) {
    } else {
      console.log(req.body.password === meeting.password);
      if (req.body.password === meeting.password) {
        meeting.participants.push(req.user._id);
        meeting.save((err) => {
          if (err) console.log(err);
          else res.redirect(`/${req.params.id}/call`);
        });
      } else {
        console.log("Password not matched");
        res.redirect(`/${req.params.id}/joinMeeting`);
      }
    }
  });
});

module.exports = router;
