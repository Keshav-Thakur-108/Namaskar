const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  local: {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    birthday: {
      type: Date,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
