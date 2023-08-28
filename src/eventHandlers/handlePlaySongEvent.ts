import { Queue, Song } from 'distube'
import EmbeddedMessage from 'src/adapters/embeddedMessage'

export default async function handlePlaySongEvent(queue: Queue, song: Song) {
  const channel = queue.textChannel

  if (!channel) return

  const message = new EmbeddedMessage({
    author: song.member?.nickname || song.member?.displayName,
    icon: song.member?.displayAvatarURL(),
    title: song.name,
    url: song.url,
    thumbnail: song.thumbnail,
    description: ['**Now Playing**', `Duration: \`${song.formattedDuration}\``].join('\n'),
  })

  channel.send({ embeds: [message.embed] })
}
