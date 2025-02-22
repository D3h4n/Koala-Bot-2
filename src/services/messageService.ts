import type EmbeddedMessage from 'src/embeds/embeddedMessage'
import IRepliable, { ReplyMessage } from '@domain/IRepliable'
import type IMessageService from '@domain/services/IMessageService'

export default class MessageService implements IMessageService {
  readonly interaction: IRepliable

  constructor(interaction: IRepliable) {
    this.interaction = interaction
  }

  async reply(message: string | EmbeddedMessage) {
    if (typeof message === 'string') {
      await this.sendReply(message)
      return
    }

    await this.sendReply(message.embed)
  }

  private async sendReply(options: ReplyMessage) {
    if (this.interaction.replied || this.interaction.deferred) {
      await this.interaction.editReply(options)
      return
    }

    await this.interaction.reply(options)
  }

  async defer() {
    if (!this.interaction.deferred && !this.interaction.replied) {
      await this.interaction.deferReply()
    }
  }

  async noReply() {
    await this.defer()
    await this.interaction.deleteReply()
  }
}
