"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setEmoji("🗳️")
              .setLabel("Vote Electra")
              .setURL(`https://top.gg/en/bot/841978658373894174`)
          );

        const embed = new EmbedBuilder()
        .setTitle("Setup Help")
        .setDescription(`Electra Setup works like this:\n\n1.) **/managesetup <setup>** -> will Setup Channel + Role for your Server\n2.) **/managebots <add> <bot>** -> will add the Bots to the Watchlist\n\n✅ Aaaaand you are done! Electra will now notify you once a bot goes offline, or online!`)

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        return;
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [PermissionsBitField.Flags.SendMessages],
    userPermissions: [PermissionsBitField.Flags.SendMessages]
};

module.exports.data = new SlashCommandBuilder()
    .setName("setup-help")
    .setDescription("Help for the Setup Command");
