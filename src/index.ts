import { ActivityType, Client, IntentsBitField, Interaction, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import CommandHandler from './commandHandler'
import Command from './common'
import CommandAdapter from './adapters/commandAdapter'
import { readCommands } from './register'
import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'
import handlePlaySongEvent from './eventHandlers/handlePlaySongEvent'
import handleAddSongEvent from './eventHandlers/handleAddSongEvent'
import handleAddPlaylistEvent from './eventHandlers/handleAddPlaylistEvent'
import DisTube from 'distube'

async function main() {
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

  const commands = readCommands('./dist/commands')

  const distube = getDistubeClient(client)

  await client
    .on('ready', () => console.log('[INFO] Ready!!!!!!'))
    .on('interactionCreate', generateInteractionListener(commands, distube))
    .login(process.env.DISCORD_BOT_TOKEN)
}

function getDistubeClient(client: Client<boolean>) {
  return new DisTube(client, {
    nsfw: true,
    leaveOnEmpty: true,
    leaveOnStop: true,
    leaveOnFinish: true,
    youtubeIdentityToken: process.env.YOUTUBE_API_KEY,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
  })
    .on('playSong', handlePlaySongEvent)
    .on('addSong', handleAddSongEvent)
    .on('addList', handleAddPlaylistEvent)
    .on('error', (_, error) => console.error(error))
}

function generateInteractionListener(commands: Command[], distube: DisTube) {
  const commandHandler = new CommandHandler(commands)
  return async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return
    const command = new CommandAdapter(interaction, distube)

    try {
      await commandHandler.run(command)
      console.log(
        `[INFO] User "${interaction.user.tag}" used command "${interaction.commandName}" in ` +
          `channel "${(interaction.channel as TextChannel).name}"`
      )
    } catch (error) {
      console.error(error)
      if (error instanceof Error) await command.message.reply(error.message)
    }
  }
}

if (require.main === module) {
  main()
}
