"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs help command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */

module.exports.run = async (interaction, utils) => {
    
  try {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Select your option")
        .addOptions([
          {
            label: "♻️ | Tracking",
            description: "View all Tracking Commands",
            value: "first",
          },

          {
            label: "🌐 | Utility",
            description: "View all Utility Coommands",
            value: "second",
          }
        ])
    );

    let embed = new MessageEmbed()
      .setTitle("Electra's Help Menu")
      .setDescription("Choose the Category you'd like to select")
      .setColor("GREEN");

    let sendmsg = await interaction.channel.send({
      content: "  ",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });

    let embed1 = new MessageEmbed()
      .setTitle("♻️ | Tracking")
      .setDescription(`
          - \`setup\`       - Setup Electra
          - \`addbot\`      - Add Bots to the Watchlist
          - \`removebot\`   - Remove Bots from the Watchlist
          - \`list\`        - List all added Bots`)
      .setColor("GREEN");

    let embed2 = new MessageEmbed()
      .setTitle("🌐 | Utility")
      .setDescription(`
          - \`help\`          - Sends this help menu
          - \`info\`          - Bot Information
          - \`ping\`          - Ping Pong
          - \`privacypolicy\` - Privacy Policy
          - \`setup-help\`    - Helper for Setup
          - \`support\`       - Setup Server Link
          - \`uptime\`        - Uptime of Electra`)
      .setColor("GREEN");

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 60000,
    });

    collector.on("collect", async (collected) => {
      const value = collected.values[0];

      if (value === "first") {
        collected.reply({ embeds: [embed1], ephemeral: true });
      }

      if (value === "second") {
        collected.reply({ embeds: [embed2], ephemeral: true });
      }

    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Help Command");
