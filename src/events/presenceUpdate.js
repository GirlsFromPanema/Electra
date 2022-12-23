"use strict";

const { PresenceUpdateStatus } = require("discord-api-types/v9");
const { Presence, EmbedBuilder } = require("discord.js");

// Database query
const Guild = require("../models/guilds.js");

module.exports.data = {
  name: "presenceUpdate",
  once: false,
};

/**
 * Handle the presenceUpdate event.
 * @param {Presence} oldPresence The presence before the update, if one at all
 * @param {Presence} newPresence The presence after the update
 */

module.exports.run = async (oldPresence, newPresence) => {
  try {
    if (!oldPresence || !oldPresence.user.bot) return;
    if (oldPresence.status === newPresence.status) return;

    // find the guild in the database
    const guildQuery = await Guild.findOne({ id: oldPresence.guild.id });
    if (guildQuery) {
      // check if the bot is a bot we need to watch
      let checker = (await guildQuery.populate("bots")).bots.find(
        (b) => b.id == oldPresence.user.id
      );
      if (!checker) return;

      /* Bot went online. */
      if (newPresence.status === PresenceUpdateStatus.Online) {
        const onlineEmbed = new EmbedBuilder()
          .setTitle("Bot went online!")
          .setDescription(
            `Looks like ${newPresence.member.displayName} (${newPresence.user.tag}) just went online!`
          )
          .setColor("Green")
          .setThumbnail(
            newPresence.user.avatarURL({ format: "png", size: 1024 })
          )
          .setTimestamp(new Date());

        newPresence.guild.channels.cache.get(guildQuery.channel)?.send({
          content: `<@&${guildQuery.role}>`,
          embeds: [onlineEmbed],
        });
      }

      if (
        /* Bot went offline. */
        newPresence.status === PresenceUpdateStatus.Offline ||
        newPresence.status === PresenceUpdateStatus.Invisible
      ) {
        const offlineEmbed = new EmbedBuilder()
          .setTitle("Bot went offline!")
          .setDescription(
            `Looks like ${newPresence.member.displayName} (${newPresence.user.tag}) just went offline!`
          )
          .setColor("Red")
          .setThumbnail(
            newPresence.user.avatarURL({ format: "png", size: 1024 })
          )
          .setTimestamp(new Date());
        newPresence.guild.channels.cache.get(guildQuery.channel)?.send({
          content: `<@&${guildQuery.role}>`,
          embeds: [offlineEmbed],
        });
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
