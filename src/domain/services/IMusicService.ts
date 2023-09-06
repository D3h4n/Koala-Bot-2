import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import type { LoopMode } from '@domain/infrastructure/IDistubeClient'
import Result from '@domain/monads/Result'

export default interface IMusicService {
  play: (query: string) => Promise<Result<void, string>>
  tryPause: () => Promise<boolean>
  tryResume: () => Promise<boolean>
  tryShuffle: () => Promise<boolean>
  trySkip: () => Promise<boolean>
  tryStop: () => Promise<boolean>
  remove: (position: number) => Promise<string | null>
  loop: (target: LoopMode) => Promise<string | null>
  getQueue: (page?: number) => EmbeddedMessage
  getNowPlaying: () => EmbeddedMessage
}
