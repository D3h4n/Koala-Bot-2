import { Client, IntentsBitField, ActivityType, Interaction } from 'discord.js'
import dotenv from 'dotenv'
import { executeCommand, MessageReplier } from './interactions'
import MusicAdapter, { MusicPlayer } from './adapters/MusicAdapter'

function getListener(musicAdapter: MusicAdapter) {
  return async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) {
      return
    }

    await interaction.deferReply()

    const name = interaction.commandName
    const data = {}
    interaction.options.data.map((option) => {
      data[option.name] = option.value
    })

    const replier: MessageReplier = {
      reply: (message) => interaction.editReply(message),
    }
    const player: MusicPlayer = {
      play: musicAdapter.play(interaction),
      stop: musicAdapter.stop(interaction),
    }

    try {
      executeCommand(name, data, replier, player)
    } catch (err) {
      console.log(err)
    }
  }
}

;(async function main() {
  dotenv.config()
  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildVoiceStates,
    ],
    presence: {
      status: 'online',
      activities: [
        {
          name: 'Making a new bot',
          type: ActivityType.Playing,
        },
      ],
    },
  })
  const musicAdapter = new MusicAdapter(client)
  await client
    .on('ready', () => {
      console.log('[SERVER] Ready!!!!!!')
    })
    .on('interactionCreate', getListener(musicAdapter))
    .login(process.env.DISCORD_BOT_TOKEN)
})()
