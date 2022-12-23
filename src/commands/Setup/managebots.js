"use strict";

const {
  SlashCommandBuilder,
  CommandInteraction,
  MessageEmbed,
  PermissionsBitField,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

// Database queries
const Guild = require("../../models/guilds");
const Bot = require("../../models/bots");

// configs
const emojis = require("../../../Controller/emoji");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  // Database query
  const guildQuery = await Guild.findOne({ id: interaction.guildId });

  // Command options
  const bot = interaction.options.getUser("bot");

  // embeds
  const success = new MessageEmbed()
    .setDescription(`Successfully added ${bot} to the watchlist`)
    .setColor("Green");

  const removed = new MessageEmbed()
    .setDescription(`Successfully removed ${bot} from the watchlist`)
    .setColor("Green");

  const error = new MessageEmbed()
    .setDescription(
      `You need to setup your Guild first before you can execute this command.`
    )
    .setColor("Red");

  const notAbot = new MessageEmbed()
    .setDescription(`You did not provide an actual Bot!`)
    .setColor("Red");

  const notAddedYet = new MessageEmbed()
    .setDescription(
      `${bot} isn't on the watchlist yet, therefore I can't remove it.`
    )
    .setColor("Red");

  const alreadyAddedEmbed = new MessageEmbed()
    .setDescription(`${bot} has already been added to the guilds watchlist`)
    .setColor("Red");

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle("LINK")
      .setEmoji("🗳️")
      .setLabel("Vote Electra")
      .setURL(`https://top.gg/en/bot/841978658373894174`)
  );

  if (sub === "add") {
    if (guildQuery) {
      /* Check if the user is a bot. */
      if (!bot.bot) {
        await interaction.followUp({
          embeds: [notAbot],
          components: [row],
          ephemeral: true,
        });
        return;
      }

      /* Check if bot is already in th db. Add them otherwise. */
      let botQuery = await Bot.findOne({ id: bot.id });
      if (!botQuery) botQuery = new Bot({ id: bot.id });

      /* Don't allow duplicate bots on the guilds watchlist. */
      let alreadyAdded = (await guildQuery.populate("bots")).bots.find(
        (b) => b.id == bot.id
      );
      if (alreadyAdded) {
        return interaction.followUp({
          embeds: [alreadyAddedEmbed],
          components: [row],
          ephemeral: true,
        });
      }

      // Push the new settings and save them.
      botQuery.guilds.push(guildQuery._id);
      guildQuery.bots.push(botQuery._id);
      await botQuery.save();
      await guildQuery.save();

      await interaction.followUp({
        embeds: [success],
        components: [row],
        ephemeral: true,
      });
    } else
      await interaction.followUp({
        embeds: [error],
        components: [row],
        ephemeral: true,
      });
  } else if (sub === "remove") {
    if (!bot.bot) {
      await interaction.followUp({
        embeds: [notAbot],
        ephemeral: true,
      });
      return;
    }

    const botQuery = await Bot.findOne({ id: bot.id });
    if (!botQuery)
      return interaction.followUp({
        embeds: [notAddedYet],
        components: [row],
        ephemeral: true,
      });

    const guildQuery2 = await Guild.findOne({
      id: interaction.guildId,
      bots: botQuery._id,
    });

    if (!guildQuery2)
      return interaction.followUp({
        embeds: [error],
        components: [row],
        ephemeral: true,
      });

    /* Update Guild (Remove ref. of the Bots within the bots array) */
    await guildQuery2.updateOne({
      $pull: { bots: botQuery._id },
    });
    await guildQuery2.save();

    /* If the bot isnt in any server, delete the bot from the entire database array */
    if (botQuery.guilds.length == 1) {
      await botQuery.remove();
      await interaction.followUp({
        embeds: [removed],
        components: [row],
        ephemeral: true,
      });
      return;
    } else {
      await botQuery.updateOne({
        $pull: { guilds: guildQuery2._id },
      });
    }

    await botQuery.save();
    await interaction.editReply({
      embeds: [removed],
      components: [row],
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [PermissionsBitField.Flags.SendMessages],
  userPermissions: [PermissionsBitField.Flags.Administrator],
};

module.exports.data = new SlashCommandBuilder()
  .setName("managebots")
  .setDescription("Add/Remove Bots to the tracker")
  .addSubcommand((sub) =>
    sub
      .setName("add")
      .setDescription("Add bots to the watchlist")
      .addUserOption((option) =>
        option
          .setName("bot")
          .setDescription("Select a bot to add to the watchlist.")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("remove")
      .setDescription("Remove Bots from the watchlist")
      .addUserOption((option) =>
        option
          .setName("bot")
          .setDescription("Remove a bot from the watchlist.")
          .setRequired(true)
      )
  );
