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

  async tryPause(): Promise<Result<string, string>> {
    return this.interaction.guildId
      ? await this.distube.tryPause(this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  async tryResume(): Promise<Result<string, string>> {
    return this.interaction.guildId
      ? await this.distube.tryResume(this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  async tryShuffle(): Promise<Result<string, string>> {
    return this.interaction.guildId
      ? await this.distube.tryShuffle(this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  async trySkip(): Promise<Result<void, string>> {
    return this.interaction.guildId
      ? await this.distube.trySkip(this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  async tryStop(): Promise<Result<void, string>> {
    return this.interaction.guildId
      ? await this.distube.tryStop(this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  // FIXME: This is the reverse of other functions. A successful result returns a string
  //        and a failed result returns null. Whereas returning a string is usually an error message.
  //        Might be useful to replace string | null with a Result type in the entire codebase, to avoid
  //        this confusion.
  async remove(position: number): Promise<Result<string, string>> {
    return this.interaction.guildId
      ? await this.distube.remove(position, this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  async loop(target: LoopMode): Promise<string | null> {
    return this.interaction.guildId
      ? await this.distube.loop(target, this.interaction.guildId)
      : null
  }

  getQueue(page: number = 1): EmbeddedMessage {
    return this.interaction.guildId
      ? this.distube.getQueue(page, this.interaction.guildId)
      : QueueMessage.EmptyQueue
  }

  getNowPlaying(): EmbeddedMessage {
    return this.interaction.guildId
      ? this.distube.getNowPlaying(this.interaction.guildId)
      : QueueMessage.EmptyQueue
  }
}
