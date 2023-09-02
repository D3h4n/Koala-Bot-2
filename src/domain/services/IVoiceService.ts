import { PermissionsBitField, APIInteractionGuildMember } from 'discord.js'

export interface IVoiceService {
  moveAll: (channel: string) => Promise<string | null>
}
export type VoiceMember = {
  permissions: Readonly<PermissionsBitField>
  voice: {
    channel: {
      members: Map<string, VoiceMember>
    } | null
    setChannel: (channel: string, reason?: string) => Promise<unknown>
  }
}
// TODO: Come up with a better name for this interface
// FIXME: APIInteractionGuildMember is added to fix type errors
//        maybe figure out a way to cleanly leave it out

export interface IVoiceInteraction {
  member: APIInteractionGuildMember | VoiceMember | null
}
