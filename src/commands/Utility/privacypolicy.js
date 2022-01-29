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
      const privacyembed = new MessageEmbed()
      .setTitle("Privacy Policy")
      .setFooter(
        `Electra Development`
      )
      .setDescription(`
      **What data do we store and why do we need it?**
      We only store Bot IDs from selfmade Bots on Discord. It's necessary because Electra is checking the Bots presence 24/7.
      
      **Where do we store the data and who has access to it?**
      We use MongoDB to store Bot IDs & Server IDs only the Developer Team is able to see these Informations.
      
      **Can I delete my data? What should I do if I have any concerns.**
      Of course, remove all of your connected Bots and remove the Bot from your Server will delete all saved Informations
      
      **Contact informations**
      Discord : Support Server / Email : blacktipemodding@gmail.com`)
      .setTimestamp()
      .setColor("BLURPLE");

        await interaction.reply({ embeds: [privacyembed], ephemeral: true });
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
    .setName("privacypolicy")
    .setDescription("Privacy Policy of Electra!");
