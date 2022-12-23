"use strict";

const {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");

const guildSchema = require("../../models/Admin/guildblacklist");
const userSchema = require("../../models/Admin/userblacklist");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Adds a bot to the watchlist.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction) => {
  try {
    await interaction.deferReply();
    const sub = interaction.options.getSubcommand();

    if (sub === "user") {
      const userID = interaction.options.getString("userid");
      const reason = interaction.options.getString("reason");

      const user = await interaction.client.users.fetch(userID);
      if (!user) return interaction.followUp({ content: "User not found." });

      const userQuery = await userSchema.findOne({ userID: user.id });
      if (!userQuery) {
        const newUser = new userSchema({
          userID: user.id,
          reason: reason,
        });
        await newUser.save();

        return interaction.followUp({
          content: `Successfully **blacklisted** user ${user.tag} (${user.id})`,
          ephemeral: true,
        });
      }

      await userSchema.findOneAndDelete({ userID: user.id });
      interaction.followUp({
        content: `Successfully **whitelisted** user ${user.tag} (${user.id})`,
        ephemeral: true,
      });
    } else if (sub === "guild") {
      const guildID = interaction.options.getString("guildid");
      const guild = await interaction.client.guilds.fetch(guildID);
      if (!guild) return interaction.followUp({ content: "Guild not found." });

      interaction.followUp({
        content: `Successfully blacklisted guild ${guild.name} (${guild.id})`,
        ephemeral: true,
      });
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
  .setName("blacklist")
  .setDescription("Blacklist a user")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("user")
      .setDescription("Blacklist a user")
      .addStringOption((option) =>
        option
          .setName("userid")
          .setDescription("The user to blacklist")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("The reason for blacklisting the user")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("guild")
      .setDescription("Blacklist a guild")
      .addStringOption((option) =>
        option
          .setName("guildid")
          .setDescription("The guild to blacklist")
          .setRequired(true)
      )
  );
