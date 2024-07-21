import IMusicService from '@domain/IMusicService'
import IMusicInteraction from '@domain/IMusicInteraction'
import IDistubeClient, { LoopMode } from '@domain/IDistubeClient'

import QueueMessage from 'src/embeds/queueMessage'
import EmbeddedMessage from 'src/embeds/embeddedMessage'
import Result, { err } from '@domain/monads/Result'

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async withGuildId<T extends Result<any, any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (guildId: string, ...args: any[]) => Promise<T> | T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): Promise<T> {
    return this.interaction.guildId
      ? action(this.interaction.guildId, ...args)
      : (err('This command should only be used in a guild') as T)
  }

  async tryPause(): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.tryPause)
  }

  async tryResume(): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.tryResume)
  }

  async tryShuffle(): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.tryShuffle)
  }

  async trySkip(): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.trySkip)
  }

  async tryStop(): Promise<Result<void, string>> {
    return await this.withGuildId(this.distube.tryStop)
  }

  async remove(position: number): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.remove, position)
  }

  async loop(target: LoopMode): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.loop, target)
  }

  async getQueue(page: number = 1): Promise<EmbeddedMessage> {
    const result = await this.withGuildId(this.distube.getQueue, page)
    return result.or(QueueMessage.EmptyQueue)
  }

  async getNowPlaying(): Promise<EmbeddedMessage> {
    const result = await this.withGuildId(this.distube.getNowPlaying)
    return result.or(QueueMessage.EmptyQueue)
  }

  async seek(timestamp: string): Promise<Result<string, string>> {
    return await this.withGuildId(this.distube.seek, timestamp)
  }
}
