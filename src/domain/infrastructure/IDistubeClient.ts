import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import IMusicInteraction from '@domain/IMusicInteraction'
import Result from '@domain/monads/Result'

export type LoopMode = 'queue' | 'song' | 'off'

export default interface IDistubeClient {
  play: (query: string, interaction: IMusicInteraction) => Promise<Result<void, string>>
  tryPause: (guildId: string) => Promise<Result<string, string>>
  tryResume: (guildId: string) => Promise<Result<string, string>>
  tryShuffle: (guildId: string) => Promise<Result<string, string>>
  trySkip: (guildId: string) => Promise<boolean>
  tryStop: (guildId: string) => Promise<boolean>
  remove: (position: number, guildId: string) => Promise<string | null>
  loop: (mode: LoopMode, guildId: string) => Promise<string | null>
  getQueue(page: number, guildId: string): EmbeddedMessage
  getNowPlaying: (guildId: string) => EmbeddedMessage
}
