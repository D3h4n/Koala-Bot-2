import { ChatInputCommandInteraction, GuildMember } from 'discord.js'

export interface Voice {
  moveAll: (channel: string) => Promise<void>
}

export default class VoiceAdapter implements Voice {
  interaction: ChatInputCommandInteraction

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction
  }

  async moveAll(channel: string) {
    const guildMember = this.interaction.member as GuildMember | null
    if (!guildMember) throw new Error('User is not in a guild')
    if (!guildMember.permissions.has('MoveMembers', true))
      throw new Error('User does not have sufficient permissions')

    const voiceChannel = guildMember.voice.channel
    if (!voiceChannel) throw new Error('User is not in a voice channel')

    voiceChannel.members.forEach((member) => {
      member.voice.setChannel(channel, 'performed yeet command')
    })
  }
}
