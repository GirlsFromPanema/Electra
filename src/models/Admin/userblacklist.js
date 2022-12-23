const { Schema, Types, model } = require("mongoose");

const userBlacklistSchema = new Schema(
  {
    userID: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserBlacklist = model("user-UserBlacklist", userBlacklistSchema);

module.exports = UserBlacklist;
