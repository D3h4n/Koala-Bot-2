import { Queue, Song } from 'distube'
import EmbeddedMessage from './embeddedMessage'

export default class QueueMessage extends EmbeddedMessage {
  static readonly QUEUE_PAGE_LENGTH = 20
  static readonly SPACE_CHARACTER = '\u2800'

  constructor(queue: Queue, page: number) {
    super(QueueMessage.getQueuePage(queue, page))
  }

  static get EmptyQueue() {
    return new EmbeddedMessage({
      title: 'Queue',
      description: 'No songs playing',
    })
  }

  private static getQueuePage(queue: Queue, page: number) {
    const numPages = Math.ceil(queue.songs.length / QueueMessage.QUEUE_PAGE_LENGTH)
    page = Math.min(page, numPages)

    return {
      title: 'Queue',
      thumbnail: queue.songs[0].thumbnail,
      description: QueueMessage.getQueueDescription(queue, page),
      footer: QueueMessage.getQueueFooter(queue, page),
    }
  }

  private static getQueueDescription(queue: Queue, page: number): string[] {
    const songs = queue.songs

    let description = ['__Now Playing:__']
    description.push(QueueMessage.getSongDescription(songs[0]))

    if (songs.length > 1) {
      description.push('\n__Up Next:__')

      const startIndex = Math.max((page - 1) * QueueMessage.QUEUE_PAGE_LENGTH, 1)
      const endIndex = Math.min(startIndex + QueueMessage.QUEUE_PAGE_LENGTH, songs.length)
      description = description.concat(
        songs
          .slice(startIndex, endIndex)
          .map((song, idx) => `${startIndex + idx}. ` + this.getSongDescription(song))
      )
    }

    return description
  }

  private static getSongDescription(song: Song) {
    return (
      `[${song.name}](${song.url}) - ${song.formattedDuration} - ` +
      `\`${song.member?.nickname || song.member?.displayName}\``
    )
  }

  private static getQueueFooter(queue: Queue, page: number) {
    const numSongs = queue.songs.length
    if (numSongs <= 1) return

    const numPages = Math.ceil(numSongs / QueueMessage.QUEUE_PAGE_LENGTH)

    return `${numSongs} songs | ${queue.formattedDuration} | Page: ${page}/${numPages}`
  }
}
