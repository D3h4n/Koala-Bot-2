import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  TextChannel,
} from 'discord.js'

export interface Message {
  reply: (message: string | EmbeddedMessage) => Promise<void>
  deferReply: () => Promise<void>
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
    if (this.interaction.replied) {
      await this.interaction.editReply(options)
      return
    }

    await this.interaction.reply(options)
  }

  async deferReply() {
    await this.interaction.deferReply()
  }

  async noReply() {
    if (!this.interaction.replied) {
      await this.interaction.deferReply()
    }

    await this.interaction.deleteReply()
  }
}

interface EmbedOptions {
  author?: string
  icon?: string
  title?: string
  url?: string
  description?: string
  thumbnail?: string
  footer?: string
}

export class EmbeddedMessage {
  readonly _builder: EmbedBuilder

  constructor(options: EmbedOptions) {
    this._builder = new EmbedBuilder()
      .setAuthor(
        !options.author
          ? null
          : {
              name: options.author,
              iconURL: options.icon,
            }
      )
      .setTitle(options.title || null)
      .setURL(options.url || null)
      .setDescription(options.description || null)
      .setThumbnail(options.thumbnail || null)
      .setFooter(!options.footer ? null : { text: options.footer })
  }

  async send(channel: TextChannel) {
    return await channel.send({ embeds: [this._builder] })
  }
}
