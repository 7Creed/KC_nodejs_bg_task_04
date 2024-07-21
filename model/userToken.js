const mongoose = require("mongoose");

const { Schema, model, Types } = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    // ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //     expires: 3600,
  //   },
});

const userTokenCollection = mongoose.model("UserToken", userTokenSchema);

module.exports = {
  userTokenCollection,
};
