const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  _id: {
    type: String,
  },
  password: {
    type: String,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, expires: "60m", default: Date.now },
});

module.exports = mongoose.model("Meeting", meetingSchema);
