import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import type { LoopMode } from '@domain/infrastructure/IDistubeClient'

export default interface IMusicService {
  play: (query: string) => Promise<string | null>
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
