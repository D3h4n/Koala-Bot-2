import { ActivityType, Client, IntentsBitField, Interaction, TextChannel } from 'discord.js'
import DisTube, { Playlist, Queue, Song } from 'distube'
import dotenv from 'dotenv'
import CommandHandler from './commandHandler'
import Command from './common'
import CommandAdapter from './adapters/commandAdapter'
import EmbeddedMessage from './adapters/embeddedMessage'
import { readCommands } from './register'

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

  const distube = new DisTube(client, {
    nsfw: false,
    leaveOnEmpty: true,
    leaveOnStop: true,
    leaveOnFinish: true,
    youtubeIdentityToken: process.env.YOUTUBE_API_KEY,
  })

  distube
    .on('playSong', handlePlaySongEvent)
    .on('addSong', handleAddSongEvent)
    .on('addList', handleAddPlaylistEvent)
    .on('error', (_, error) => console.error(error))

  await client
    .on('ready', () => console.log('[INFO] Ready!!!!!!'))
    .on('interactionCreate', generateInteractionListener(commands, distube))
    .login(process.env.DISCORD_BOT_TOKEN)
}

async function handlePlaySongEvent(queue: Queue, song: Song) {
  const channel = queue.textChannel as TextChannel

  if (!channel) return

  const message = await new EmbeddedMessage({
    author: song.member?.nickname || song.member?.displayName,
    icon: song.member?.displayAvatarURL(),
    title: song.name,
    url: song.url,
    thumbnail: song.thumbnail,
    description: 'Now Playing',
  }).send(channel)
  setTimeout(() => message?.delete(), 10000)
}

async function handleAddSongEvent(queue: Queue, song: Song) {
  const position = queue.songs.indexOf(song)
  const channel = queue.textChannel as TextChannel

  if (position === 0 || !channel) return

  const message = await new EmbeddedMessage({
    author: song.member?.nickname || song.member?.displayName,
    icon: song.member?.displayAvatarURL(),
    title: song.name,
    description: `Added Song\nPosition: ${position}`,
    thumbnail: song.thumbnail,
    url: song.url,
  }).send(channel)
  setTimeout(() => message.delete(), 5000)
}

async function handleAddPlaylistEvent(queue: Queue, playlist: Playlist) {
  const channel = queue.textChannel as TextChannel

  if (!channel) return

  const message = await new EmbeddedMessage({
    author: playlist.member?.nickname || playlist.member?.displayName,
    icon: playlist.member?.displayAvatarURL(),
    title: playlist.name,
    url: playlist.url,
    thumbnail: playlist.thumbnail,
    description: 'New Playlist Added',
  }).send(channel)
  setTimeout(() => message?.delete(), 5000)
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
