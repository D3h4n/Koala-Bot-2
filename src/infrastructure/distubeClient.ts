import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'
import { GuildMember, GuildTextBasedChannel } from 'discord.js'
import DisTube, { Playlist, Queue, RepeatMode, Song } from 'distube'

import ILogger from '@domain/ILogger'
import IClientProvider from '@domain/IClientProvider'
import IMusicInteraction from '@domain/IMusicInteraction'
import Result, { err, isOk, ok } from '@domain/monads/Result'
import IDistubeClient, { LoopMode } from '@domain/infrastructure/IDistubeClient'

import QueueMessage from 'src/embeds/queueMessage'
import AddSongMessage from 'src/embeds/addSongMessage'
import EmbeddedMessage from 'src/embeds/embeddedMessage'
import PlaySongMessage from 'src/embeds/playSongMessage'
import AddPlaylistMessage from 'src/embeds/addPlaylistMessage'
import NowPlayingMessage from 'src/embeds/nowPlayingMessage'

export default class DistubeClient implements IDistubeClient {
  private readonly client: DisTube

  constructor(client: IClientProvider, logger?: ILogger) {
    this.client = new DisTube(client.getClient(), {
      nsfw: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    })

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
      channel.send(message.embed)
      logger?.debug(`Playing "${song.name}" in "${queue.voiceChannel?.name}"`)
    }
  }

  private static handleAddSongEvent(logger?: ILogger) {
    return (queue: Queue, song: Song) => {
      const position = queue.songs.indexOf(song)
      const channel = queue.textChannel

      if (!channel) return

      const message = new AddSongMessage(song, position)
      channel.send(message.embed)
      logger?.debug(`Added "${song.name}" to queue`)
    }
  }

  private static handleAddPlaylistEvent(logger?: ILogger) {
    return (queue: Queue, playlist: Playlist) => {
      const channel = queue.textChannel

      if (!channel) return

      const message = new AddPlaylistMessage(playlist)
      channel.send(message.embed)
      logger?.debug(`Added "${playlist.name}" to queue`)
    }
  }

  async play(query: string, interaction: IMusicInteraction): Promise<Result<void, string>> {
    const member = <GuildMember | null>interaction.member
    const voiceChannel = member?.voice.channel

    if (!voiceChannel) return err('Member not in voice channel')
    if (!interaction.channel) return err('Invalid text channel')

    await this.client.play(voiceChannel, query, {
      member,
      textChannel: <GuildTextBasedChannel>interaction.channel,
    })
    return ok()
  }

  async tryPause(guildId: string): Promise<Result<string, string>> {
    const queue = this.client.getQueue(guildId)
    if (!queue) return err('No songs in queue')
    if (!queue.playing) return ok('Song is already paused')
    queue.pause()
    return ok('Pausing song')
  }

  async tryResume(guildId: string): Promise<Result<string, string>> {
    const queue = this.client.getQueue(guildId)
    if (!queue) return err('No songs in queue')
    if (queue.playing) return ok('Song is already resumed')
    queue.resume()
    return ok('Resuming song')
  }

  async tryShuffle(guildId: string): Promise<Result<string, string>> {
    const queue = this.client.getQueue(guildId)

    if (!queue) {
      return err('No songs in queue')
    }

    await queue.shuffle()
    return ok('Shuffled queue')
  }

  async trySkip(guildId: string): Promise<Result<void, string>> {
    const result = await this.remove(0, guildId)
    return isOk(result) ? ok() : result
  }

  async tryStop(guildId: string): Promise<Result<void, string>> {
    const queue = this.client.getQueue(guildId)
    if (!queue) return err('No songs in queue')

    await queue.stop()
    return ok()
  }

  async remove(position: number, guildId: string): Promise<Result<string, string>> {
    const queue = this.client.getQueue(guildId)
    if (!queue) return err('No songs in queue')
    if (queue.songs.length <= position) return err('No song at that position')

    const song = queue.songs[position]

    if (queue.songs.length === 1) {
      await queue.stop()
    } else if (position === 0) {
      await queue.skip()
    } else {
      queue.songs.splice(position, 1)
    }

    return ok(`Removed \`${song.name}\` at position ${position}`)
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

  getQueue(page: number, guildId: string): EmbeddedMessage {
    const queue = this.client.getQueue(guildId)
    return queue && queue.songs.length >= 1
      ? new QueueMessage(queue, page)
      : QueueMessage.EmptyQueue
  }

  getNowPlaying(guildId: string): EmbeddedMessage {
    const queue = this.client.getQueue(guildId)
    return queue && queue.songs.length >= 1 ? new NowPlayingMessage(queue) : QueueMessage.EmptyQueue
  }
}
