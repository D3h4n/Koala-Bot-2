import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import IMusicInteraction from '@domain/IMusicInteraction'
import Result from '@domain/monads/Result'

export type LoopMode = 'queue' | 'song' | 'off'

export default interface IDistubeClient {
  play: (query: string, interaction: IMusicInteraction) => Promise<Result<void, string>>
  tryPause: (guildId: string) => Promise<Result<string, string>>
  tryResume: (guildId: string) => Promise<Result<string, string>>
  tryShuffle: (guildId: string) => Promise<Result<string, string>>
  trySkip: (guildId: string) => Promise<Result<string, string>>
  tryStop: (guildId: string) => Promise<Result<void, string>>
  remove: (guildId: string, position: number) => Promise<Result<string, string>>
  loop: (guildId: string, mode: LoopMode) => Promise<Result<string, string>>
  getQueue: (guildId: string, page: number) => Result<EmbeddedMessage, string>
  getNowPlaying: (guildId: string) => Result<EmbeddedMessage, string>
  seek: (guildId: string, timestamp: string) => Promise<Result<string, string>>
}
