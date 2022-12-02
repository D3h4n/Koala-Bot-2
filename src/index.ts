import { ActivityType, Client, EmbedBuilder, IntentsBitField } from 'discord.js'
import dotenv from 'dotenv'
import DisTube, { Playlist, Queue, Song } from 'distube'
import commands from './commandHandler'
import { CommandAdapter } from './adapters/commandAdapter'

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
    .on('ready', () => {
      console.log('[INFO] Ready!!!!!!')
    })
    .on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return
      await interaction.deferReply()
      await commands.run(new CommandAdapter(interaction, distube))
    })
    .login(process.env.DISCORD_BOT_TOKEN)
}

async function handlePlaySongEvent(queue: Queue, song: Song) {
  const message = await queue.textChannel?.send({
    embeds: [
      new EmbedBuilder({
        author: {
          name: song.member?.nickname || song.member?.displayName || 'Anonymous',
          iconURL: song.member?.displayAvatarURL(),
        },
        title: song.name || 'Unknown',
        url: song.url,
        thumbnail: {
          url: song.thumbnail || '',
        },
        description: 'Now Playing',
      }),
    ],
  })

  setTimeout(() => message?.delete(), 10000)
}

async function handleAddSongEvent(queue: Queue, song: Song) {
  const position = queue.songs.indexOf(song)

  if (position === 0) return

  const message = await queue.textChannel?.send({
    embeds: [
      new EmbedBuilder({
        author: {
          name: song.member?.nickname || song.member?.displayName || 'Anonymous',
          iconURL: song.member?.displayAvatarURL(),
        },
        title: song.name || 'Unknown',
        url: song.url,
        thumbnail: {
          url: song.thumbnail || '',
        },
        description: `Added Song\nPosition: ${position}`,
      }),
    ],
  })

  setTimeout(() => message?.delete(), 5000)
}

async function handleAddPlaylistEvent(queue: Queue, playlist: Playlist) {
  const message = await queue.textChannel?.send({
    embeds: [
      new EmbedBuilder({
        author: {
          name: playlist.member?.nickname || playlist.member?.displayName || 'Anonymous',
          iconURL: playlist.member?.displayAvatarURL(),
        },
        title: playlist.name,
        url: playlist.url,
        thumbnail: {
          url: playlist.thumbnail || '',
        },
        description: 'New Playlist Inbound',
      }),
    ],
  })

  setTimeout(() => message?.delete(), 5000)
}

main()
