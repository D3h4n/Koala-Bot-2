import { ChatInputCommandInteraction, GuildMember } from 'discord.js'

export interface IVoiceAdapter {
  moveAll: (channel: string) => Promise<string | null>
}

export default class VoiceAdapter implements IVoiceAdapter {
  interaction: ChatInputCommandInteraction

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction
  }

  async moveAll(channel: string): Promise<string | null> {
    const guildMember = this.interaction.member as GuildMember | null
    if (!guildMember) return 'Failed to find guild member'
    if (!guildMember.permissions.has('MoveMembers', true))
      return `${guildMember} you're not cool enough to use this command. (requires 'MoveMembers' permission)`

    const voiceChannel = guildMember.voice.channel
    if (!voiceChannel) return `${guildMember} you're not in a voice channel`

    voiceChannel.members.forEach((member) => {
      member.voice.setChannel(channel, 'performed yeet command')
    })
    return null
  }
}
