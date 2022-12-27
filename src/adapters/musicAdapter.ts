import DisTube, { Queue, Song } from 'distube'
import { EmbeddedMessage, Message } from './messageAdapter'

export interface MusicPlayer {
  play: (query: string) => Promise<void>
  queue: (page?: number) => Promise<void>
  shuffle: () => Promise<void>
  skip: () => Promise<void>
  stop: () => Promise<void>
  remove: (position: number) => Promise<void>
}

export default class MusicAdapter implements MusicPlayer {
  static readonly QUEUE_PAGE_LENGTH = 20
  static readonly SPACE_CHARACTER = '\u2800'

  private readonly distube: DisTube
  private readonly message: Message
  private readonly songQueue: Queue | undefined

  constructor(distube: DisTube, message: Message) {
    this.distube = distube
    this.message = message
    if (this.message.interaction) this.songQueue = this.distube.getQueue(this.message.interaction)
  }

  async play(query: string) {
    const member = this.message.member
    const voiceChannel = member?.voice.channel

    if (!voiceChannel) {
      await this.message.reply('Join a voice channel')
      return
    }

    await this.distube.play(voiceChannel, query, {
      member,
      textChannel: this.message.channel,
    })
    await this.message.noReply()
  }

  async queue(page = 1) {
    if (!this.songQueue) return this.message.reply('No songs are playing')
    await this.message.replyWithEmbeddedMessage(this.getQueuePage(page))
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
    await this.message.reply('Shuffled queue')
  }

  async skip() {
    if (this.songQueue && this.songQueue.songs.length > 1) {
      await this.songQueue.skip()
      return await this.message.noReply()
    }

    await this.stop()
  }

  async stop() {
    await this.songQueue?.stop()
    await this.message.noReply()
  }

  async remove(position: number) {
    if (!this.songQueue || this.songQueue.songs.length < position + 1) {
      await this.message.reply('Not that many songs')
      return
    }

    const [song] = this.songQueue.songs.splice(position, 1)
    await this.message.reply(`Removed \`${song.name}\` at position ${position}`)
  }
}
