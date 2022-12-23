"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle("LINK")
        .setEmoji("📙")
        .setLabel("Support Server")
        .setURL(`https://discord.gg/63fffVBWT8`)
    );

    const embed = new EmbedBuilder()
      .setTitle("Support Server")
      .setDescription("If you need help with Electra, click the button below");
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
    return;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [PermissionsBitField.Flags.SendMessages],
  userPermissions: [PermissionsBitField.Flags.SendMessages],
};

module.exports.data = new SlashCommandBuilder()
  .setName("support")
  .setDescription("Support Server");
