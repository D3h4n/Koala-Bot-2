import { Queue } from 'distube'
import EmbeddedMessage from './embeddedMessage'

export default class NowPlayingMessage extends EmbeddedMessage {
  constructor(queue: Queue) {
    const song = queue.songs[0]
    super({
      author: song.member?.nickname || song.member?.displayName,
      icon: song.member?.displayAvatarURL(),
      title: song.name,
      url: song.url,
      image: song.thumbnail,
      description: [
        `By: [${song.uploader.name}](${song.uploader.url})`,
        `\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
      ],
    })
  }
}
