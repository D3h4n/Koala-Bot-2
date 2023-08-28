import { Song } from 'distube'
import EmbeddedMessage from './embeddedMessage'

export default class PlaySongMessage extends EmbeddedMessage {
  constructor(song: Song) {
    super({
      author: song.member?.nickname || song.member?.displayName,
      icon: song.member?.displayAvatarURL(),
      title: song.name,
      url: song.url,
      image: song.thumbnail,
      description: ['**Now Playing**', `Duration: \`${song.formattedDuration}\``],
    })
  }
}
