"use strict";

const { Client } = require("discord.js");

const guildBlacklist = require("../models/Admin/guildblacklist");

module.exports.data = {
  name: "guildCreate",
  once: false,
};

/**
 * Handle the clients ready event.
 * @param {Client} client The client that triggered the event.
 */
module.exports.run = async (guild) => {
  const guildQuery = await guildBlacklist.findOne({ guild: guild.id });
  if (guildQuery) return guild.leave();
};
