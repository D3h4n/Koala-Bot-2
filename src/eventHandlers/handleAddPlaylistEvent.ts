import { Playlist, Queue } from 'distube'
import EmbeddedMessage from 'src/adapters/embeddedMessage'

export default async function handleAddPlaylistEvent(queue: Queue, playlist: Playlist) {
  const channel = queue.textChannel

  if (!channel) return

  const message = new EmbeddedMessage({
    author: playlist.member?.nickname || playlist.member?.displayName,
    icon: playlist.member?.displayAvatarURL(),
    title: playlist.name,
    url: playlist.url,
    thumbnail: playlist.thumbnail,
    description: [
      '**New Playlist Added**',
      `No. Songs: \`${playlist.songs.length}\``,
      `Duration: \`${playlist.formattedDuration}\``,
    ].join('\n'),
  })

  await channel.send({ embeds: [message.embed] })
}
