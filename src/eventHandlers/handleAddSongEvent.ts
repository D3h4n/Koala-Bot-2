import { Queue, Song } from 'distube'
import EmbeddedMessage from 'src/adapters/embeddedMessage'

export default async function handleAddSongEvent(queue: Queue, song: Song) {
  const position = queue.songs.indexOf(song)
  const channel = queue.textChannel

  if (position === 0 || !channel) return

  const message = new EmbeddedMessage({
    author: song.member?.nickname || song.member?.displayName,
    icon: song.member?.displayAvatarURL(),
    title: song.name,
    thumbnail: song.thumbnail,
    url: song.url,
    description: [
      '**Added Song**',
      `Duration: \`${song.formattedDuration}\``,
      `Position: ${position}`,
    ].join('\n'),
  })

  await channel.send({ embeds: [message.embed] })
}
