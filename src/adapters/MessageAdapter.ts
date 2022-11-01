import { EmbedBuilder } from 'discord.js'
import { MessageReplier } from '../interactions'

interface MessageHandler {
  editReply: (options) => Promise<unknown>
  deleteReply: () => Promise<void>
}

export default class MessageAdapter implements MessageReplier {
  readonly interaction: MessageHandler

  constructor(interaction: MessageHandler) {
    this.interaction = interaction
  }

  async reply(message: string) {
    await this.interaction.editReply(message)
  }

  async replyWithEmbed(embed: EmbedAdapter) {
    await this.interaction.editReply({ embeds: [embed._builder] })
  }

  async noReply() {
    await this.interaction.deleteReply()
  }
}

export class EmbedAdapter {
  readonly _builder: EmbedBuilder

  constructor(builder?: EmbedBuilder) {
    this._builder = builder || new EmbedBuilder()
  }

  setAuthor(author: string, icon?: string) {
    this._builder.setAuthor({
      name: author,
      iconURL: icon,
    })
    return this
  }

  setTitle(title?: string) {
    this._builder.setTitle(title || null)
    return this
  }

  setURL(url?: string) {
    this._builder.setURL(url || null)
    return this
  }

  setImage(image?: string) {
    this._builder.setImage(image || null)
    return this
  }

  setThumbnail(thumbnail?: string) {
    this._builder.setThumbnail(thumbnail || null)
    return this
  }

  setDescription(description?: string) {
    this._builder.setDescription(description || null)
    return this
  }

  setFooter(footer: string) {
    this._builder.setFooter({
      text: footer,
    })
    return this
  }
}
