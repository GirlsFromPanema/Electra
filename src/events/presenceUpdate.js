"use strict";

const { PresenceUpdateStatus } = require("discord-api-types/v9");
const { Presence, MessageActionRow, MessageButton } = require("discord.js");
const Guild = require("../models/guilds.js");
const { red } = require("colors/safe");

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
    if (oldPresence.status == newPresence.status) return;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setEmoji("🗳️")
        .setLabel("Vote Electra")
        .setURL(`https://top.gg/en/bot/841978658373894174`)
    );

    // find the guild in the database
    const guildQuery = await Guild.findOne({ id: oldPresence.guild.id });
    if (guildQuery) {
      // check if the bot is a bot we need to watch
      let checker = (await guildQuery.populate("bots")).bots.find(
        (b) => b.id == oldPresence.user.id
      );
      if (!checker) return;

      /* Bot went online. */
      if (newPresence.status == PresenceUpdateStatus.Online) {
        newPresence.guild.channels.cache.get(guildQuery.channel)?.send({
          content: `<@&${guildQuery.role}>`,
          embeds: [
            {
              title: "Bot went online!",
              description: `Looks like ${newPresence.member.displayName} (${newPresence.user.tag}) just went online!`,
              color: "GREEN",
              thumbnail: {
                url: newPresence.user.avatarURL({ format: "png", size: 1024 }),
              },
              timestamp: new Date(),
            },
          ],
          components: [row]
        });
      } else if (

      /* Bot went offline. */
        newPresence.status == PresenceUpdateStatus.Offline ||
        newPresence.status == PresenceUpdateStatus.Invisible
      ) {
        newPresence.guild.channels.cache.get(guildQuery.channel)?.send({
          content: `<@&${guildQuery.role}>`,
          embeds: [
            {
              title: "Bot went offline!",
              description: `Looks like ${newPresence.member.displayName} (${newPresence.user.tag}) just went offline!`,
              color: "RED",
              thumbnail: {
                url: newPresence.user.avatarURL({ format: "png", size: 1024 }),
              },
              timestamp: new Date(),
            },
          ],
          components: [row]
        });
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
