import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'

export interface Message {
  member?: GuildMember
  channel?: TextChannel
  interaction?: ChatInputCommandInteraction

  reply: (message: string) => Promise<void>
  replyWithEmbeddedMessage: (embed: EmbeddedMessage) => Promise<void>
  noReply: () => Promise<void>
}

export default class MessageAdapter implements Message {
  readonly interaction: ChatInputCommandInteraction
  readonly member: GuildMember | undefined
  readonly channel: TextChannel | undefined

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction
    this.member = interaction.member as GuildMember | undefined
    this.channel = interaction.channel?.isTextBased()
      ? (interaction.channel as TextChannel)
      : undefined
  }

  async reply(message: string) {
    await this.interaction.editReply(message)
  }

  async replyWithEmbeddedMessage(message: EmbeddedMessage) {
    await this.interaction.editReply({ embeds: [message._builder] })
  }

  async noReply() {
    await this.interaction.deleteReply()
  }
}

interface EmbedOptions {
  title?: string
  description?: string
  footer?: string
}

export class EmbeddedMessage {
  readonly _builder: EmbedBuilder

  constructor(options: EmbedOptions) {
    this._builder = new EmbedBuilder()
      .setTitle(options.title || null)
      .setDescription(options.description || null)
      .setFooter({ text: options.footer || ' ' })
  }
}
