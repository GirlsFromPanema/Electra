"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
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
    const privacyembed = new EmbedBuilder()
      .setTitle("Privacy Policy")
      .setFooter({ text: "Electra Development" })
      .setDescription(
        `
      **What data do we store and why do we need it?**
      We collect the Guild ID, the bot - role and channel IDs for the presence tracking.
      
      **Where do we store the data and who has access to it?**
      We use are powerful and secure Database to save your data for our service.
      
      **Can I delete my data? What should I do if I have any concerns.**
      You can reset/delete all of your data by running the <option>/reset command.
      
      **Contact informations**
      Discord : Support Server / Email : blacktipemodding@gmail.com`
      )
      .setTimestamp()
      .setColor("BLURPLE");

    await interaction.reply({ embeds: [privacyembed], ephemeral: true });
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
  .setName("privacypolicy")
  .setDescription("Privacy Policy of Electra!");
