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
        `Please read our privacy policy [here](https://github.com/GirlsFromPanema/Electra/blob/main/privacy-policy.md)
        
        Info: You can simply delete your data by using the \`/delete\` option on the setup command.`
      )
      .setTimestamp()
      .setColor("Blurple");

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
