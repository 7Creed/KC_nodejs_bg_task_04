const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    purpose: {
      type: String,
    },
  },
  { timestamps: true }
);

const userCollection = mongoose.model("users", userSchema);

module.exports = {
  userCollection,
};
