import {
  Client,
  IntentsBitField,
  ActivityType
} from 'discord.js'
import dotenv from 'dotenv'
import {handleCommand} from "./interactions";


(async function main() {
  dotenv.config();
  const client = new Client({
    intents: [
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions
    ],
    presence: {
      status: "online",
      activities: [{
        name: "Making a new bot",
        type: ActivityType.Playing
      }]
    }
  });

  await client
      .on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand()) {
          const name = interaction.command?.name || "no name";
          const data = {};

          interaction.options.data.forEach((option) => {
            data[option.name] = option.value;
          })
          handleCommand(name, data, interaction)
        }
      })
      .login(process.env.DISCORD_BOT_TOKEN);
})()

