import { Playlist } from 'distube'
import EmbeddedMessage from './embeddedMessage'

export default class AddPlaylistMessage extends EmbeddedMessage {
  constructor(playlist: Playlist) {
    super({
      author: playlist.member?.nickname || playlist.member?.displayName,
      icon: playlist.member?.displayAvatarURL(),
      title: playlist.name,
      url: playlist.url,
      image: playlist.thumbnail,
      description: [
        '**New Playlist Added**',
        `No. Songs: \`${playlist.songs.length}\``,
        `Duration: \`${playlist.formattedDuration}\``,
      ],
    })
  }
}
