"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
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
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setEmoji("📙")
        .setLabel("Support Server")
        .setURL(`https://discord.gg/63fffVBWT8`)
    );

    const embed = new MessageEmbed()
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
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("support")
  .setDescription("Support Server");
