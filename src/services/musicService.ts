import IMusicService, { IMusicInteraction } from '../domain/services/IMusicService'
import IDistubeClient, { LoopMode } from '../domain/infrastructure/IDistubeClient'

import EmbeddedMessage from '../embeds/embeddedMessage'
import QueueMessage from '../embeds/queueMessage'

export default class MusicService implements IMusicService {
  private readonly distube: IDistubeClient
  private readonly interaction: IMusicInteraction

  constructor(interaction: IMusicInteraction, distubeClient: IDistubeClient) {
    this.distube = distubeClient
    this.interaction = interaction
  }

  play(query: string): Promise<string | null> {
    return this.distube.play(query, this.interaction)
  }

  async tryPause(): Promise<boolean> {
    if (!this.interaction.guildId) return false
    return await this.distube.tryPause(this.interaction.guildId)
  }

  async tryResume(): Promise<boolean> {
    return this.interaction.guildId ? await this.distube.tryResume(this.interaction.guildId) : false
  }

  getQueue(page: number = 1): EmbeddedMessage {
    return this.interaction.guildId
      ? this.distube.getQueue(page, this.interaction.guildId)
      : QueueMessage.EmptyQueue
  }

  async tryShuffle(): Promise<boolean> {
    return this.interaction.guildId
      ? await this.distube.tryShuffle(this.interaction.guildId)
      : false
  }

  async trySkip(): Promise<boolean> {
    return this.interaction.guildId ? await this.distube.trySkip(this.interaction.guildId) : false
  }

  async tryStop(): Promise<boolean> {
    return this.interaction.guildId ? await this.distube.tryStop(this.interaction.guildId) : false
  }

  // FIXME: This is the reverse of other functions. A successful result returns a string
  //        and a failed result returns null. Whereas returning a string is usually an error message.
  //        Might be useful to replace string | null with a Result type in the entire codebase, to avoid
  //        this confusion.
  async remove(position: number): Promise<string | null> {
    return this.interaction.guildId
      ? await this.distube.remove(position, this.interaction.guildId)
      : null
  }

  async loop(target: LoopMode): Promise<string | null> {
    return this.interaction.guildId
      ? await this.distube.loop(target, this.interaction.guildId)
      : null
  }
}
