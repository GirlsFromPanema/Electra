"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, PermissionsBitField } = require("discord.js");
const { msToTimeObj, colorPalette } = require("../../util/util.js");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs uptime command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const timeObj = msToTimeObj(interaction.client.uptime);

    await interaction.reply({
      embeds: [
        {
          color: colorPalette.brandingColor,
          title: "Uptime",
          description: `**${timeObj.days}** days, **${timeObj.hours}** hours, **${timeObj.minutes}** minutes, **${timeObj.seconds}** seconds`,
          footer: {
            text: "🌐 Powered by Fairfight",
          },
          thumbnail: {
            url: interaction.client.user.avatarURL({
              format: "png",
              size: 1024,
            }),
          },
        },
      ],
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [PermissionsBitField.Flags.SendMessages],
  userPermissions: [PermissionsBitField.Flags.SendMessages],
};

module.exports.data = new SlashCommandBuilder()
  .setName("uptime")
  .setDescription("Shows how long the bot has been running for.");
