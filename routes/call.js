const express = require("express");
const router = express.Router();

router.get("/:roomId/call", (req, res) => {
  res.render("room", {
    roomId: req.params.roomId,
    style: "room.css",
  });
});

module.exports = router;
