import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import IMusicInteraction from '@domain/IMusicInteraction'
import Result from '@domain/monads/Result'

export type LoopMode = 'queue' | 'song' | 'off'

export default interface IDistubeClient {
  play: (query: string, interaction: IMusicInteraction) => Promise<Result<void, string>>
  tryPause: (guildId: string) => Promise<boolean>
  tryResume: (guildId: string) => Promise<boolean>
  getQueue(page: number, guildId: string): EmbeddedMessage
  tryShuffle: (guildId: string) => Promise<boolean>
  trySkip: (guildId: string) => Promise<boolean>
  tryStop: (guildId: string) => Promise<boolean>
  remove: (position: number, guildId: string) => Promise<string | null>
  loop: (mode: LoopMode, guildId: string) => Promise<string | null>
  getNowPlaying: (guildId: string) => EmbeddedMessage
}
