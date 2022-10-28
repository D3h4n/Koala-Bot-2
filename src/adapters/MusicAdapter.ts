import DisTube from 'distube'
import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  GuildMember,
  TextChannel,
} from 'discord.js'

type PlayMethod = (string) => Promise<void>
type StopMethod = () => Promise<void>

export interface MusicPlayer {
  play: PlayMethod
  stop: StopMethod
}

export default class MusicAdapter {
  distube: DisTube

  constructor(client: Client) {
    this.distube = new DisTube(client, {
      nsfw: false,
      leaveOnEmpty: true,
      leaveOnStop: true,
    })
    this.setupDistube()
  }

  setupDistube() {
    this.distube.on('playSong', (queue, song) => {
      queue.textChannel?.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: song.member?.nickname || 'Anonymous',
              iconURL: song.member?.displayAvatarURL(),
            })
            .setTitle(song.name || 'Unknown Name')
            .setURL(song.url)
            .setImage(song.thumbnail || null),
        ],
      })
    })
  }

  play(interaction: ChatInputCommandInteraction): PlayMethod {
    return async (song: string) => {
      const member = interaction.member as GuildMember

      const voiceChannel = member.voice.channel

      if (!voiceChannel) {
        await interaction.reply('[ERROR] Join a voice channel')
        return
      }

      await this.distube.play(voiceChannel, song, {
        member,
        textChannel: interaction.channel as TextChannel,
      })
      await interaction.deleteReply()
    }
  }

  stop(interaction: ChatInputCommandInteraction): StopMethod {
    return () => this.distube.stop(interaction)
  }
}
