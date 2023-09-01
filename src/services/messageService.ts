import EmbeddedMessage from '../embeds/embeddedMessage'
import type { EmbedBuilder } from 'discord.js'

export interface IMessageService {
  reply: (message: string | EmbeddedMessage) => Promise<void>
  defer: () => Promise<void>
  noReply: () => Promise<void>
}

type ReplyOptions = string | { embeds: EmbedBuilder[] }

export interface IRepliable {
  replied: boolean
  deferred: boolean
  editReply: (options: ReplyOptions) => Promise<unknown>
  reply: (options: ReplyOptions) => Promise<unknown>
  deferReply: () => Promise<unknown>
  deleteReply: () => Promise<unknown>
}

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

    await this.sendReply({ embeds: [message.embed] })
  }

  private async sendReply(options: ReplyOptions) {
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
    this.defer()
    await this.interaction.deleteReply()
  }
}
