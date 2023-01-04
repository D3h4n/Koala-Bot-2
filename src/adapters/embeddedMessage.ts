import { EmbedBuilder, TextChannel } from 'discord.js'

interface EmbedOptions {
  author?: string
  icon?: string
  title?: string
  url?: string
  description?: string
  thumbnail?: string
  footer?: string
}

export default class EmbeddedMessage {
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
