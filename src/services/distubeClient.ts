import DisTube, { Playlist, Queue, Song } from 'distube'
import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'
import { IDiscordClient } from './discordClient'
import EmbeddedMessage from '../adapters/embeddedMessage'

export interface IDistubeClient {
  client: DisTube
  registerEventHandlers: () => void
}

export default class DistubeClient implements IDistubeClient {
  client: DisTube

  constructor(client: IDiscordClient, youtubeAPIKey?: string) {
    this.client = new DisTube(client.client, {
      nsfw: true,
      leaveOnEmpty: true,
      leaveOnStop: true,
      leaveOnFinish: true,
      youtubeIdentityToken: youtubeAPIKey,
      plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    })
  }

  registerEventHandlers() {
    this.client
      .on('playSong', this.handlePlaySongEvent)
      .on('addSong', this.handleAddSongEvent)
      .on('addList', this.handleAddPlaylistEvent)
      .on('error', (_, error) => console.error(error))
  }

  async handlePlaySongEvent(queue: Queue, song: Song) {
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

  async handleAddSongEvent(queue: Queue, song: Song) {
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

  async handleAddPlaylistEvent(queue: Queue, playlist: Playlist) {
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
}
