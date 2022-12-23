"use strict";

const {
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const path = require("path");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

module.exports.ownerOnly = {
  ownerOnly: true,
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    delete require.cache[path.join(__dirname, "../../deployCommands.js")];
    require("../../deployCommands.js");
    await interaction.reply({
      content: "Redeployed all commands.",
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [PermissionsBitField.Flags.SendMessages],
  userPermissions: [PermissionsBitField.Flags.Administrator],
};

module.exports.data = new SlashCommandBuilder()
  .setName("deploycommands")
  .setDescription("Deploys all commands.");
