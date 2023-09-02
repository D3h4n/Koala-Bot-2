import { APIInteractionGuildMember, TextBasedChannel } from 'discord.js'
import EmbeddedMessage from '../../embeds/embeddedMessage'
import { VoiceMember } from '../VoiceInteraction'

export interface IMusicInteraction {
  member: APIInteractionGuildMember | VoiceMember | null
  channel: TextBasedChannel | null
  guildId: string | null
}

export default interface IMusicService {
  play: (query: string) => Promise<string | null>
  tryPause: () => Promise<boolean>
  tryResume: () => Promise<boolean>
  getQueue: (page?: number) => EmbeddedMessage
  tryShuffle: () => Promise<boolean>
  trySkip: () => Promise<boolean>
  tryStop: () => Promise<boolean>
  remove: (position: number) => Promise<string | null>
  loop: (target: 'queue' | 'song' | 'off') => Promise<string | null>
}
