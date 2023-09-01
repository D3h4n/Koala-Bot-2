import QueueMessage from '../embeds/queueMessage'
import type EmbeddedMessage from '../embeds/embeddedMessage'
import type { IDistubeClient, IMusicInteraction } from '../services/distubeClient'

export interface IMusicAdapter {
  play: (query: string) => Promise<string | null>
  tryPause: () => Promise<boolean>
  tryResume: () => Promise<boolean>
  getQueue: (page?: number) => EmbeddedMessage
  tryShuffle: () => Promise<boolean>
  trySkip: () => Promise<boolean>
  tryStop: () => Promise<boolean>
  remove: (position: number) => Promise<string | null>
}

export default class MusicAdapter implements IMusicAdapter {
  private readonly distube: IDistubeClient
  private readonly interaction: IMusicInteraction

  constructor(interaction: IMusicInteraction, distubeClient: IDistubeClient) {
    this.distube = distubeClient
    this.interaction = interaction
  }

  async play(query: string): Promise<string | null> {
    return this.distube.play(query, this.interaction)
  }

  async tryPause(): Promise<boolean> {
    if (!this.interaction.guildId) return false
    return this.distube.tryPause(this.interaction.guildId)
  }

  async tryResume(): Promise<boolean> {
    return this.interaction.guildId ? this.distube.tryResume(this.interaction.guildId) : false
  }

  getQueue(page: number = 1): EmbeddedMessage {
    return this.interaction.guildId
      ? this.distube.getQueue(page, this.interaction.guildId)
      : QueueMessage.EmptyQueue
  }

  async tryShuffle(): Promise<boolean> {
    return this.interaction.guildId ? this.distube.tryShuffle(this.interaction.guildId) : false
  }

  async trySkip(): Promise<boolean> {
    return this.interaction.guildId ? this.distube.trySkip(this.interaction.guildId) : false
  }

  async tryStop(): Promise<boolean> {
    return this.interaction.guildId ? this.distube.tryStop(this.interaction.guildId) : false
  }

  // FIXME: This is the reverse of other functions. A successful result returns a string
  //        and a failed result returns null. Whereas returning a string is usually an error message.
  //        Might be useful to replace string | null with a Result type in the entire codebase, to avoid
  //        this confusion.
  async remove(position: number): Promise<string | null> {
    return this.interaction.guildId ? this.distube.remove(position, this.interaction.guildId) : null
  }
}
