import {
  Client,
  IntentsBitField,
  ActivityType,
  GuildMember,
  Interaction,
  TextChannel,
} from 'discord.js'
import dotenv from 'dotenv'
import { executeCommand, MessageReplier, MusicPlayer } from './interactions'
import DisTube from 'distube'

function getListener(distube: DisTube) {
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
      play: (song: string) => {
        const member = interaction.member as GuildMember
        const voiceChannel = member.voice.channel

        if (!voiceChannel) {
          interaction.editReply('Join a voice channel.')
          return
        }

        distube.play(voiceChannel, song, {
          member: member,
          textChannel: interaction.channel as TextChannel,
        })

        interaction.deleteReply()
      },
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
  const distube = new DisTube(client, { nsfw: false })
  await client
    .on('interactionCreate', getListener(distube))
    .login(process.env.DISCORD_BOT_TOKEN)
})()
