import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import IMusicInteraction from '@domain/IMusicInteraction'
import Result from '@domain/monads/Result'

export type LoopMode = 'queue' | 'song' | 'off'

export default interface IDistubeClient {
  play: (query: string, interaction: IMusicInteraction) => Promise<Result<void, string>>
  tryPause: (interaction: IMusicInteraction) => Promise<Result<string, string>>
  tryResume: (interaction: IMusicInteraction) => Promise<Result<string, string>>
  tryShuffle: (interaction: IMusicInteraction) => Promise<Result<string, string>>
  trySkip: (interaction: IMusicInteraction) => Promise<Result<string, string>>
  tryStop: (interaction: IMusicInteraction) => Promise<Result<void, string>>
  remove: (interaction: IMusicInteraction, position: number) => Promise<Result<string, string>>
  loop: (interaction: IMusicInteraction, mode: LoopMode) => Promise<Result<string, string>>
  getQueue: (interaction: IMusicInteraction, page: number) => Result<EmbeddedMessage, string>
  getNowPlaying: (interaction: IMusicInteraction) => Result<EmbeddedMessage, string>
  seek: (interaction: IMusicInteraction, timestamp: string) => Promise<Result<string, string>>
}
