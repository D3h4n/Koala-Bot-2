import DisTube, { Playlist, Queue, Song } from 'distube'
import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'
import { IDiscordClient } from './discordClient'
import EmbeddedMessage from '../adapters/embeddedMessage'
import { ILogger } from './logger'

export interface IDistubeClient {
  client: DisTube
  registerEventHandlers: (logger: ILogger) => void
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

  registerEventHandlers(logger: ILogger) {
    this.client
      .on('playSong', this.handlePlaySongEvent(logger))
      .on('addSong', this.handleAddSongEvent(logger))
      .on('addList', this.handleAddPlaylistEvent(logger))
      .on('error', (_, error) => logger.error(error))
  }

  handlePlaySongEvent(logger: ILogger) {
    return (queue: Queue, song: Song) => {
      const channel = queue.textChannel

      if (!channel) return

      const message = new EmbeddedMessage({
        author: song.member?.nickname || song.member?.displayName,
        icon: song.member?.displayAvatarURL(),
        title: song.name,
        url: song.url,
        image: song.thumbnail,
        description: ['**Now Playing**', `Duration: \`${song.formattedDuration}\``],
      })

      channel.send({ embeds: [message.embed] })
      logger.info(`Playing "${song.name}" in "${queue.voiceChannel?.name}"`)
    }
  }

  handleAddSongEvent(logger: ILogger) {
    return (queue: Queue, song: Song) => {
      const position = queue.songs.indexOf(song)
      const channel = queue.textChannel

      if (position === 0 || !channel) return

      const message = new EmbeddedMessage({
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

      channel.send({ embeds: [message.embed] })
      logger.info(`Added "${song.name}" to queue`)
    }
  }

  handleAddPlaylistEvent(logger: ILogger) {
    return (queue: Queue, playlist: Playlist) => {
      const channel = queue.textChannel

      if (!channel) return

      const message = new EmbeddedMessage({
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

      channel.send({ embeds: [message.embed] })
      logger.info(`Added "${playlist.name}" to queue`)
    }
  }
}
