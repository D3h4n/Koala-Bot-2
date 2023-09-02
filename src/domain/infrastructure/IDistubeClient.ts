import ILogger from './ILogger'
import EmbeddedMessage from '../../embeds/embeddedMessage'
import { IMusicInteraction } from '../services/IMusicService'

export type LoopMode = 'queue' | 'song' | 'off'

export default interface IDistubeClient {
  registerEventHandlers: (logger?: ILogger) => void
  play: (query: string, interaction: IMusicInteraction) => Promise<string | null>
  tryPause: (guildId: string) => Promise<boolean>
  tryResume: (guildId: string) => Promise<boolean>
  getQueue(page: number, guildId: string): EmbeddedMessage
  tryShuffle: (guildId: string) => Promise<boolean>
  trySkip: (guildId: string) => Promise<boolean>
  tryStop: (guildId: string) => Promise<boolean>
  remove: (position: number, guildId: string) => Promise<string | null>
  loop: (mode: LoopMode, guildId: string) => Promise<string | null>
}
