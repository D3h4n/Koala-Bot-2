import DisTube from 'distube'
import {
  ChatInputCommandInteraction,
  GuildMember,
  TextChannel,
} from 'discord.js'
import MessageAdapter, { EmbedAdapter } from './MessageAdapter'
import { MusicPlayer } from '../interactions'

export default class MusicAdapter implements MusicPlayer {
  distube: DisTube
  interaction: ChatInputCommandInteraction
  replier: MessageAdapter

  constructor(distube: DisTube, interaction: ChatInputCommandInteraction) {
    this.distube = distube
    this.interaction = interaction
    this.replier = new MessageAdapter(interaction)
  }

  async play(query: string) {
    const member = this.interaction.member as GuildMember
    const voiceChannel = member.voice.channel

    if (!voiceChannel) {
      await this.replier.reply('Join a voice channel')
      return
    }

    await this.distube.play(voiceChannel, query, {
      member,
      textChannel: this.interaction.channel as TextChannel,
    })
    await this.replier.noReply()
  }

  async stop() {
    try {
      await this.distube.stop(this.interaction)
    } catch (e) {
      console.error(e)
    } finally {
      await this.replier.noReply()
    }
  }

  async queue(pageNumber = 1) {
    const queue = this.distube.getQueue(this.interaction)

    if (!queue) {
      await this.replier.reply('No songs are playing')
      return
    }

    const songs = queue.songs
    const queuePageLength = 20
    const numPages = Math.ceil(songs.length / queuePageLength)
    const nowPlaying = songs[0]

    let description =
      `__Now Playing:__\n` +
      `[${nowPlaying.name}](${nowPlaying.url}) - ` +
      `${nowPlaying.formattedDuration} - ` +
      `\`${nowPlaying.member?.displayName}\`\n\n`

    if (songs.length > 1) {
      let startIndex = (pageNumber - 1) * queuePageLength

      if (startIndex > songs.length) {
        startIndex = 0
      }

      const endIndex = Math.min(startIndex + queuePageLength, songs.length)

      description += '__Up Next:__\n'
      const songDescriptions = songs
        .slice(startIndex || 1, endIndex)
        .map(
          (song, idx) =>
            `${(startIndex || 1) + idx}. ` +
            `[${song.name}](${song.url}) - ` +
            `${song.formattedDuration} - ` +
            `\`${song.member?.nickname || song.member?.displayName}\``
        )
        .join('\n')
      description += songDescriptions
    }

    await this.replier.replyWithEmbed(
      new EmbedAdapter()
        .setTitle('Queue')
        .setDescription(description)
        .setFooter(
          `Page: ${pageNumber}/${numPages}` +
            '\u2800'.repeat(40) +
            songs.length +
            ` song${songs.length > 1 ? 's' : ''}` +
            ` | ${queue.formattedDuration}`
        )
    )
  }

  async skip() {
    await this.distube.skip(this.interaction)
    this.interaction.deleteReply()
  }

  async shuffle() {
    await this.distube.shuffle(this.interaction)
    this.replier.reply('Shuffled queue')
  }
}
