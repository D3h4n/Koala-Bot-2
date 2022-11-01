import {
  ActivityType,
  Client,
  EmbedBuilder,
  IntentsBitField,
  Interaction,
} from 'discord.js'
import dotenv from 'dotenv'
import { executeCommand } from './interactions'
import Adapter from './adapters/Adapter'
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

  const distube = new DisTube(client, {
    nsfw: false,
    leaveOnEmpty: true,
    leaveOnStop: true,
  })
    .on('playSong', async (queue, song) => {
      const message = await queue.textChannel?.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name:
                song.member?.nickname ||
                song.member?.displayName ||
                'Anonymous',
              iconURL: song.member?.displayAvatarURL(),
            })
            .setTitle(song.name || 'Unknown')
            .setURL(song.url)
            .setThumbnail(song.thumbnail || null)
            .setDescription('Now Playing'),
        ],
      })

      setTimeout(() => message?.delete(), 10000)
    })
    .on('addList', async (queue, playlist) => {
      const message = await queue.textChannel?.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name:
                playlist.member?.nickname ||
                playlist.member?.displayName ||
                'Anonymous',
              iconURL: playlist.member?.displayAvatarURL(),
            })
            .setTitle(playlist.name)
            .setURL(playlist.url || null)
            .setThumbnail(playlist.thumbnail || null)
            .setDescription('New Playlist Inbound'),
        ],
      })

      setTimeout(() => message?.delete(), 5000)
    })

  await client
    .on('ready', () => {
      console.log('[INFO] Ready!!!!!!')
    })
    .on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) {
        return
      }
      await interaction.deferReply()

      try {
        executeCommand(
          interaction.commandName,
          interaction.options.data.reduce((prev, option) => {
            prev[option.name] = option.value
            return prev
          }, {}),
          new Adapter(interaction, distube)
        )
      } catch (err) {
        console.log(err)
      }
    })
    .login(process.env.DISCORD_BOT_TOKEN)
}

main()
