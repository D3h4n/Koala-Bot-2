import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import type { LoopMode } from '@domain/infrastructure/IDistubeClient'
import Result from '@domain/monads/Result'

export default interface IMusicService {
  play: (query: string) => Promise<Result<void, string>>
  tryPause: () => Promise<Result<string, string>>
  tryResume: () => Promise<Result<string, string>>
  tryShuffle: () => Promise<Result<string, string>>
  trySkip: () => Promise<Result<void, string>>
  tryStop: () => Promise<Result<void, string>>
  remove: (position: number) => Promise<Result<string, string>>
  loop: (target: LoopMode) => Promise<Result<string, string>>
  getQueue: (page?: number) => EmbeddedMessage
  getNowPlaying: () => EmbeddedMessage
  seek: (timestamp: string) => Promise<Result<string, string>>
}
