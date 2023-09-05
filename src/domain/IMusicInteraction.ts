import { VoiceMember } from '@domain/VoiceInteraction'
import { APIInteractionGuildMember, TextBasedChannel } from 'discord.js'

export default interface IMusicInteraction {
  member: APIInteractionGuildMember | VoiceMember | null
  channel: TextBasedChannel | null
  guildId: string | null
}
