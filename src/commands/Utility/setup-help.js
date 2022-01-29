"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

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
        const embed = new MessageEmbed()
        .setTitle("Setup Help")
        .setDescription(`Electra Setup works like this:\n\n1.) **/setup** -> will Setup Channel + Role for your Server\n2.) **/add-bot + bot** -> will add the Bots to the Watchlist\n\n✅ Aaaaand you are done! Electra will now notify you once a bot goes offline, or online!\n\n⚠️You might have seen, that the bot is sending the tracking status even tho the Bot isn't added. It's a problem with the Slash Commands not registrating information correctly.\n\nThanks for using me!`)

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.SEND_MESSAGES]
};

module.exports.data = new SlashCommandBuilder()
    .setName("setup-help")
    .setDescription("Help for the Setup Command");
