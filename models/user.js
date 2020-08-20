const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  local: {
    email: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  google: {
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  github: {
    url: {
      type: String,
    },
    username: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
