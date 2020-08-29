const express = require("express");
const { json } = require("body-parser");
const Meeting = require("../models/meeting");
const router = express.Router();

router.get("/:roomId/call", (req, res) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  else if (req.isAuthenticated()) {
    Meeting.findOne({ _id: req.params.roomId }, (err, meeting) => {
      if (err) console.log(err);
      else if (!meeting) res.redirect("/");
      else {
        if (meeting.participants.includes(req.user._id)) {
          res.render("room", {
            style: "room.css",
          });
        } else {
          res.redirect(`/${req.params.roomId}/joinMeeting`);
        }
      }
    });
  } else {
    res.render("room", {
      style: "room.css",
    });
  }
});

module.exports = router;
