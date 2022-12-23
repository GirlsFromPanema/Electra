"use strict";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { getAllFiles } = require("./util/util.js");
const { green } = require("colors/safe");

const local = process.env.LOCAL;

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const commands = [];

const commandFiles = getAllFiles(path.join(__dirname, "./commands"));
for (const file of commandFiles) {
  const command = require(`${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
(async () => {
  try {
    console.log(green("Started refreshing application (/) commands."));
    await rest
      .put(
        local
          ? Routes.applicationGuildCommands(clientId, guildId)
          : Routes.applicationCommands(clientId),
        { body: commands }
      )
      .then((c) => {
        console.log(green("Successfully reloaded application (/) commands."));
        return Promise.resolve(commands);
      });
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
})();
