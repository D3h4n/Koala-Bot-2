import IMusicService from '@domain/IMusicService'
import IMusicInteraction from '@domain/IMusicInteraction'
import IDistubeClient, { LoopMode } from '@domain/IDistubeClient'

import QueueMessage from 'src/embeds/queueMessage'
import EmbeddedMessage from 'src/embeds/embeddedMessage'
import Result, { err, isErr, ok } from '@domain/monads/Result'

export default class MusicService implements IMusicService {
  private readonly distube: IDistubeClient
  private readonly interaction: IMusicInteraction
  private static readonly TIMESTAMP_PATTERN = /(\d{1,2})(:\d{2})?(:\d{2})?/ // Matches timestamps (HH:MM:SS) eg: 1:01:1, 12:00, 5

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

  async remove(position: number): Promise<Result<string, string>> {
    return this.interaction.guildId
      ? await this.distube.remove(position, this.interaction.guildId)
      : err('This command should only be used in a guild')
  }

  async loop(target: LoopMode): Promise<Result<string, string>> {
    return this.interaction.guildId
      ? await this.distube.loop(target, this.interaction.guildId)
      : err('This command should only be used in a guild')
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

  async seek(timestamp: string): Promise<Result<string, string>> {
    const timeResult = MusicService.getTimeInSeconds(timestamp)

    if (isErr(timeResult)) return timeResult

    if (!this.interaction.guildId) return err('This command should only be used in a guild')

    const result = await this.distube.seek(timeResult.data, this.interaction.guildId)
    return isErr(result) ? result : ok(`Skipped to \`${timestamp}\``)
  }

  static getTimeInSeconds(timestamp: string): Result<number, string> {
    const result = timestamp.match(MusicService.TIMESTAMP_PATTERN)

    if (!result || result[0] !== timestamp) {
      return err(`Invalid timestamp "${timestamp}"`)
    }

    return ok(
      result
        .slice(1) // start at the first group
        .filter((r) => r) // remove undefined groups
        .reduce((prev, curr) => prev * 60 + Number(curr.replace(':', '')), 0)
    )
  }
}
