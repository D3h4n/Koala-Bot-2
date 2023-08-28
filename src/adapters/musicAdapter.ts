import DisTube, { Queue, Song } from 'distube'
import { ChatInputCommandInteraction, GuildMember, TextChannel } from 'discord.js'
import EmbeddedMessage from './embeddedMessage'

export interface IMusicAdapter {
  play: (query: string) => Promise<void>
  tryPause: () => Promise<boolean>
  tryResume: () => Promise<boolean>
  queue: (page?: number) => EmbeddedMessage
  shuffle: () => Promise<void>
  skip: () => Promise<void>
  stop: () => Promise<void>
  remove: (position: number) => Promise<string>
}

export default class MusicAdapter implements IMusicAdapter {
  static readonly QUEUE_PAGE_LENGTH = 20
  static readonly SPACE_CHARACTER = '\u2800'

  private readonly distube: DisTube
  private readonly member?: GuildMember
  private readonly channel?: TextChannel
  private readonly songQueue?: Queue

  constructor(interaction: ChatInputCommandInteraction, distube: DisTube) {
    this.distube = distube
    this.member = (interaction.member as GuildMember | null) ?? undefined
    this.channel = (interaction.channel as TextChannel | null) ?? undefined
    this.songQueue = this.distube.getQueue(interaction)
  }

  async play(query: string) {
    const member = this.member
    const voiceChannel = member?.voice.channel

    if (!voiceChannel) throw new Error('Member not in voice channel')

    await this.distube.play(voiceChannel, query, {
      member,
      textChannel: this.channel,
    })
  }

  async tryPause() {
    if (!this.songQueue?.playing) return false
    this.songQueue.pause()
    return true
  }

  async tryResume() {
    if (!this.songQueue?.paused) return false
    this.songQueue.resume()
    return true
  }

  queue(page = 1) {
    if (!this.songQueue) throw new Error('No songs in queue')
    return this.getQueuePage(page)
  }

  private getQueuePage(page: number) {
    if (!this.songQueue)
      throw new Error('FATAL: song queue is undefined while generating queue page')

    const numPages = Math.ceil(this.songQueue.songs.length / MusicAdapter.QUEUE_PAGE_LENGTH)
    page = Math.min(page, numPages)

    return new EmbeddedMessage({
      title: 'Queue',
      description: this.getQueueDescription(page),
      footer: this.getQueueFooter(page),
    })
  }

  private getQueueDescription(pageNumber: number): string {
    if (!this.songQueue)
      throw new Error('FATAL: song queue is undefined while generating queue description')

    const songs = this.songQueue.songs

    let description = `__Now Playing:__\n`
    description += this.getSongDescription(songs[0])

    if (songs.length > 1) {
      description += '\n\n__Up Next:__\n'

      const startIndex = Math.max((pageNumber - 1) * MusicAdapter.QUEUE_PAGE_LENGTH, 1)
      const endIndex = Math.min(startIndex + MusicAdapter.QUEUE_PAGE_LENGTH, songs.length)
      description += songs
        .slice(startIndex, endIndex)
        .map((song, idx) => `${startIndex + idx}. ` + this.getSongDescription(song))
        .join('\n')
    }

    return description
  }

  private getSongDescription(song: Song) {
    return (
      `[${song.name}](${song.url}) - ${song.formattedDuration} - ` +
      `\`${song.member?.nickname || song.member?.displayName}\``
    )
  }

  private getQueueFooter(currentPage: number) {
    if (!this.songQueue)
      throw new Error('FATAL: song queue is undefined while generating queue footer')

    const numSongs = this.songQueue.songs.length
    if (numSongs <= 1) return

    const numPages = Math.ceil(numSongs / MusicAdapter.QUEUE_PAGE_LENGTH)
    const formattedQueueDuration = this.songQueue.formattedDuration

    return (
      `${numSongs} songs | ${formattedQueueDuration}` +
      MusicAdapter.SPACE_CHARACTER.repeat(43) +
      `Page: ${currentPage}/${numPages}`
    )
  }

  async shuffle() {
    await this.songQueue?.shuffle()
  }

  async skip() {
    if (this.songQueue && this.songQueue.songs.length > 1) {
      await this.songQueue.skip()
    } else {
      await this.stop()
    }
  }

  async stop() {
    await this.songQueue?.stop()
  }

  async remove(position: number) {
    if (!this.songQueue || this.songQueue.songs.length < position + 1) {
      throw new Error('No song at that position')
    }

    const [song] = this.songQueue.songs.splice(position, 1)
    return song.name || 'Unnamed Song'
  }
}
