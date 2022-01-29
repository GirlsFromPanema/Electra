"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Sets up the bot for first use.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const isSetup = await Guild.findOne({ id: interaction.guildId });
        if (!isSetup)
        {
            const role = interaction.options.getRole("role", true);
            const channel = interaction.options.getChannel("channel", true);

            if (channel.type != "GUILD_TEXT")
            {
                interaction.reply({ content: "Expected a text channel.", ephemeral: true });
                return;
            }
            if(!role) {
                interaction.reply({ content: "This is not a valid Role!", ephemeral: true})
            }

            const newGuild = new Guild({
                id: interaction.guildId,
                role: role.id,
                channel: channel.id
            });
            newGuild.save();

            interaction.reply({ content: "Guild setup successfully.", ephemeral: true });
        } else {
            const role = interaction.options.getRole("role", true);
            const channel = interaction.options.getChannel("channel", true);

            await Guild.findOneAndUpdate({ 
                id: interaction.guildId, 
                channel: channel.id, 
                role: role.id 
            })
            await interaction.reply({ content: `Successfully set the tracking to ${channel} with the ${role} Role.`})
        }
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot.")
    .addRoleOption(option => option.setName("role").setDescription("The role you wish to be pinged on a bot status change.").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("The channel you wish to be notified in about bot status updates.").setRequired(true));
