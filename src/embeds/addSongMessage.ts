import { Song } from 'distube'
import EmbeddedMessage from './embeddedMessage'

export default class AddSongMessage extends EmbeddedMessage {
  constructor(song: Song, position: number) {
    super({
      author: song.member?.nickname || song.member?.displayName,
      icon: song.member?.displayAvatarURL(),
      title: song.name,
      image: song.thumbnail,
      url: song.url,
      description: [
        '**Added Song**',
        `Duration: \`${song.formattedDuration}\``,
        `Position: ${position}`,
      ],
    })
  }
}
