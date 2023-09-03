import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'
import DisTube, { Playlist, Queue, RepeatMode, Song } from 'distube'
import type { GuildMember, GuildTextBasedChannel } from 'discord.js'

import type { IMusicInteraction } from '@domain/IMusicService'
import type IClientProvider from '@domain/IClientProvider'
import type IDistubeClient from '@domain/IDistubeClient'
import type ILogger from '@domain/ILogger'

import QueueMessage from 'embeds/queueMessage'
import AddSongMessage from 'embeds/addSongMessage'
import EmbeddedMessage from 'embeds/embeddedMessage'
import PlaySongMessage from 'embeds/playSongMessage'
import AddPlaylistMessage from 'embeds/addPlaylistMessage'

export type LoopMode = 'queue' | 'song' | 'off'

export default class DistubeClient implements IDistubeClient {
  client: DisTube

  constructor(client: IClientProvider, youtubeAPIKey?: string) {
    this.client = new DisTube(client.client, {
      nsfw: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      youtubeIdentityToken: youtubeAPIKey,
      plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    })
  }

  registerEventHandlers(logger?: ILogger) {
    this.client
      .on('playSong', DistubeClient.handlePlaySongEvent(logger))
      .on('addSong', DistubeClient.handleAddSongEvent(logger))
      .on('addList', DistubeClient.handleAddPlaylistEvent(logger))
      .on('error', (_, error) => logger?.error(error))
  }

  private static handlePlaySongEvent(logger?: ILogger) {
    return (queue: Queue, song: Song) => {
      const channel = queue.textChannel

      if (!channel) return

      const message = new PlaySongMessage(song)
      channel.send({ embeds: [message.embed] })
      logger?.debug(`Playing "${song.name}" in "${queue.voiceChannel?.name}"`)
    }
  }

  private static handleAddSongEvent(logger?: ILogger) {
    return (queue: Queue, song: Song) => {
      const position = queue.songs.indexOf(song)
      const channel = queue.textChannel

      if (!channel) return

      const message = new AddSongMessage(song, position)
      channel.send({ embeds: [message.embed] })
      logger?.debug(`Added "${song.name}" to queue`)
    }
  }

  private static handleAddPlaylistEvent(logger?: ILogger) {
    return (queue: Queue, playlist: Playlist) => {
      const channel = queue.textChannel

      if (!channel) return

      const message = new AddPlaylistMessage(playlist)
      channel.send({ embeds: [message.embed] })
      logger?.debug(`Added "${playlist.name}" to queue`)
    }
  }

  async play(query: string, interaction: IMusicInteraction): Promise<string | null> {
    const member = <GuildMember | null>interaction.member
    const voiceChannel = member?.voice.channel

    if (!voiceChannel) return 'Member not in voice channel'
    if (!interaction.channel) return 'Invalid text channel'

    await this.client.play(voiceChannel, query, {
      member,
      textChannel: <GuildTextBasedChannel>interaction.channel,
    })
    return null
  }

  async tryPause(guildId: string): Promise<boolean> {
    const queue = this.client.getQueue(guildId)
    if (!queue?.playing) return false
    queue.pause()
    return true
  }

  async tryResume(guildId: string): Promise<boolean> {
    const queue = this.client.getQueue(guildId)
    if (!queue?.paused) return false
    queue.resume()
    return true
  }

  getQueue(page: number, guildId: string): EmbeddedMessage {
    const queue = this.client.getQueue(guildId)
    return queue ? new QueueMessage(queue, page) : QueueMessage.EmptyQueue
  }

  async tryShuffle(guildId: string): Promise<boolean> {
    const queue = this.client.getQueue(guildId)

    if (!queue) {
      return false
    }

    await queue.shuffle()
    return true
  }

  async trySkip(guildId: string): Promise<boolean> {
    const queue = this.client.getQueue(guildId)
    if (!queue) return false

    if (queue.songs.length > 1) {
      await queue.skip()
    } else {
      await queue.stop()
    }

    return true
  }

  async tryStop(guildId: string): Promise<boolean> {
    const queue = this.client.getQueue(guildId)
    if (!queue) return false

    await queue.stop()
    return true
  }

  async remove(position: number, guildId: string): Promise<string | null> {
    const queue = this.client.getQueue(guildId)
    if (queue && queue.songs.length > position) {
      const [song] = queue.songs.splice(position, 1)
      return song.name || 'Unnamed Song'
    }

    return null
  }

  async loop(mode: LoopMode, guildId: string): Promise<string | null> {
    const queue = this.client.getQueue(guildId)

    if (!queue || queue.songs.length < 1) {
      return null
    }

    switch (mode) {
      case 'song':
        queue.setRepeatMode(RepeatMode.SONG)
        return `Looping \`${queue.songs[0].name}\`.`

      case 'queue':
        queue.setRepeatMode(RepeatMode.QUEUE)
        return 'Looping queue.'

      case 'off':
        queue.setRepeatMode(RepeatMode.DISABLED)
        return 'Stopped looping'

      default:
        throw new Error('Unhandled loop mode')
    }
  }
}
