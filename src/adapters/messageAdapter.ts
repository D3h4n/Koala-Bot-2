import { ChatInputCommandInteraction, InteractionReplyOptions } from 'discord.js'
import EmbeddedMessage from './embeddedMessage'

export interface Message {
  reply: (message: string | EmbeddedMessage) => Promise<void>
  defer: () => Promise<void>
  noReply: () => Promise<void>
}

export default class MessageAdapter implements Message {
  readonly interaction: ChatInputCommandInteraction

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction
  }

  async reply(message: string | EmbeddedMessage) {
    if (typeof message === 'string') {
      await this.sendReply(message)
      return
    }

    await this.sendReply({ embeds: [message._builder] })
  }

  private async sendReply(options: InteractionReplyOptions | string) {
    if (this.interaction.replied || this.interaction.deferred) {
      await this.interaction.editReply(options)
      return
    }

    await this.interaction.reply(options)
  }

  async defer() {
    await this.interaction.deferReply()
  }

  async noReply() {
    if (!this.interaction.replied && !this.interaction.deferred) {
      await this.interaction.deferReply()
    }

    await this.interaction.deleteReply()
  }
}
