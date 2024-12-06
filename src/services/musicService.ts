import type IMusicService from '@domain/IMusicService'
import type IMusicInteraction from '@domain/IMusicInteraction'
import IDistubeClient, { LoopMode } from '@domain/IDistubeClient'

import QueueMessage from 'src/embeds/queueMessage'
import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import type Result from '@domain/monads/Result'

export default class MusicService implements IMusicService {
  private readonly distube: IDistubeClient
  private readonly interaction: IMusicInteraction

  constructor(interaction: IMusicInteraction, distubeClient: IDistubeClient) {
    this.distube = distubeClient
    this.interaction = interaction
  }

  play(query: string): Promise<Result<void, string>> {
    return this.distube.play(query, this.interaction)
  }

  async tryPause(): Promise<Result<string, string>> {
    return await this.distube.tryPause(this.interaction)
  }

  async tryResume(): Promise<Result<string, string>> {
    return await this.distube.tryResume(this.interaction)
  }

  async tryShuffle(): Promise<Result<string, string>> {
    return await this.distube.tryShuffle(this.interaction)
  }

  async trySkip(): Promise<Result<string, string>> {
    return await this.distube.trySkip(this.interaction)
  }

  async tryStop(): Promise<Result<void, string>> {
    return await this.distube.tryStop(this.interaction)
  }

  async remove(position: number): Promise<Result<string, string>> {
    return await this.distube.remove(this.interaction, position)
  }

  async loop(target: LoopMode): Promise<Result<string, string>> {
    return await this.distube.loop(this.interaction, target)
  }

  async getQueue(page: number = 1): Promise<EmbeddedMessage> {
    const result = this.distube.getQueue(this.interaction, page)
    return result.or(QueueMessage.EmptyQueue)
  }

  async getNowPlaying(): Promise<EmbeddedMessage> {
    const result = this.distube.getNowPlaying(this.interaction)
    return result.or(QueueMessage.EmptyQueue)
  }

  async seek(timestamp: string): Promise<Result<string, string>> {
    return await this.distube.seek(this.interaction, timestamp)
  }
}
