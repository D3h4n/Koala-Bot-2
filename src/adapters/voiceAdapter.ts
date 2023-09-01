import { APIInteractionGuildMember, PermissionsBitField } from 'discord.js'

export interface IVoiceAdapter {
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

export default class VoiceAdapter implements IVoiceAdapter {
  interaction: IVoiceInteraction

  constructor(interaction: IVoiceInteraction) {
    this.interaction = interaction
  }

  async moveAll(channel: string): Promise<string | null> {
    const guildMember = this.interaction.member as VoiceMember | null
    if (!guildMember) return 'Failed to find guild member'
    if (!guildMember.permissions.has('MoveMembers', true))
      return `${guildMember} you're not cool enough to use this command. (requires 'MoveMembers' permission)`

    const voiceChannel = guildMember.voice.channel
    if (!voiceChannel) return `${guildMember} you're not in a voice channel`

    voiceChannel.members.forEach((member) => {
      member.voice!.setChannel(channel, 'performed yeet command')
    })
    return null
  }
}
