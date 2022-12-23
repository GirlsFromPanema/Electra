const { Schema, Types, model } = require("mongoose");

const guildBlacklistSchema = new Schema(
  {
    guildID: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const GuildBlacklist = model("guild-blacklist", guildBlacklistSchema);

module.exports = GuildBlacklist;
