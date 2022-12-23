"use strict";

const { CommandInteraction, SlashCommandBuilder, PermissionsBitField, MessageEmbed } = require("discord.js");
const Guild = require("../../models/guilds.js");
const Bot = require("../../models/bots.js");
const bot = require("../../models/bots.js");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Adds a bot to the watchlist.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    /* Check if guild is setup. */
    const guildQuery = await Guild.find({ id: interaction.guildId });

    if (!guildQuery?.length) {
      return interaction.reply({
        content: "This Guild has no Setup done.\n=> No Bots",
        ephemeral: true,
      });
    }

    if (guildQuery) {
      const totalBots = await Bot.find({ guilds: guildQuery[0]._id });

      if (!totalBots?.length) {
        return interaction.reply({
          content: "No bots",
          ephemeral: true,
        });
      }

      const allbots = totalBots
        .map((bot) => {
          return [`Bot: <@${bot.id}>`].join("\n");
        })
        .join("\n");

      const embed = new MessageEmbed()
        .setTitle(`${interaction.guild.name}'s Bots`)
        .setDescription(allbots)
        .setColor("Red")
        .setTimestamp();

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [PermissionsBitField.Flags.SendMessages],
  userPermissions: [PermissionsBitField.Flags.Administrator],
};

module.exports.data = new SlashCommandBuilder()
  .setName("list")
  .setDescription("Check Bots on watchlist");
