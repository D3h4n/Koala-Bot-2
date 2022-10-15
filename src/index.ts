import {
  Client,
  IntentsBitField,
  ActivityType
} from 'discord.js'
import dotenv from 'dotenv'


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
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    interaction.reply("Hello World");
  })
  await client.login(process.env.DISCORD_BOT_TOKEN);
})()

