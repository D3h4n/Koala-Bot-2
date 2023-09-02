import { IVoiceService, VoiceMember, IVoiceInteraction } from 'src/domain/services/IVoiceService'

export default class VoiceService implements IVoiceService {
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
