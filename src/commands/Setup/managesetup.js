"use strict";
const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionsBitField,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

// Database query
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Sets up the bot for first use.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  // Database query
  const isSetup = await Guild.findOne({ id: interaction.guildId });

  // Command options
  const role = interaction.options.getRole("role");
  const channel = interaction.options.getChannel("channel");

  // embeds
  const success = new MessageEmbed()
    .setDescription(`Successfully setup the guild.`)
    .setColor("GREEN");

  const change = new MessageEmbed()
    .setDescription(
      `Successfully updated guild setup.\n\nRole: ${role}\nChannel: ${channel}`
    )
    .setColor("GREEN");

  const reset = new MessageEmbed()
    .setDescription(
      `Successfully removed the guild setup.\n\nSad to see you go, u can setup me again any time running \`/managesetup <setup>\``
    )
    .setColor("GREEN");

  const resetError = new MessageEmbed()
    .setDescription(
      `**${interaction.guild.name}** has no setup done yet, I can't remove anything here.`
    )
    .setColor("RED");

  const notAChannel = new MessageEmbed()
    .setDescription(`Expected a valid **text** channel.`)
    .setColor("RED");

  const notARole = new MessageEmbed()
    .setDescription(`This is not a valid role.`)
    .setColor("RED");

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle("LINK")
      .setEmoji("🗳️")
      .setLabel("Vote Electra")
      .setURL(`https://top.gg/en/bot/841978658373894174`)
  );

  try {
    if (sub === "setup") {
      if (!isSetup) {
        if (channel.type != "GUILD_TEXT") {
          interaction.followUp({
            embeds: [notAChannel],
            components: [row],
            ephemeral: true,
          });
          return;
        }
        if (!role)
          return interaction.followUp({
            embeds: [notARole],
            components: [row],
            ephemeral: true,
          });

        const newGuild = new Guild({
          id: interaction.guildId,
          role: role.id,
          channel: channel.id,
        });
        newGuild.save();

        interaction.followUp({
          embeds: [success],
          components: [row],
          ephemeral: true,
        });
      } else {
        await Guild.findOneAndUpdate({
          id: interaction.guildId,
          channel: channel.id,
          role: role.id,
        });
        await interaction.followUp({
          embeds: [change],
          components: [row],
          ephemeral: true,
        });
      }
    } else if (sub === "reset") {
      if (!isSetup)
        return interaction.followUp({
          embeds: [resetError],
          components: [row],
          ephemeral: true,
        });

      isSetup.delete();
      interaction.followUp({
        embeds: [reset],
        components: [row],
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
  .setName("managesetup")
  .setDescription("Setup the bot.")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup the bot")
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription(
            "The role you wish to be pinged on a bot status change."
          )
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            "The channel you wish to be notified in about bot status updates."
          )
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("reset").setDescription("Reset the bots setup")
  );
