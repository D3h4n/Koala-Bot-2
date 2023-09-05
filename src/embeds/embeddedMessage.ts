import { EmbedBuilder } from 'discord.js'

interface IEmbedOptions {
  author?: string
  icon?: string
  title?: string
  url?: string
  description?: string | string[]
  thumbnail?: string
  image?: string
  footer?: string
}

export default class EmbeddedMessage {
  private readonly message: EmbedBuilder

  constructor(options: IEmbedOptions) {
    this.message = new EmbedBuilder()
      .setAuthor(
        options.author
          ? {
              name: options.author,
              iconURL: options.icon,
            }
          : null
      )
      .setTitle(options.title || null)
      .setURL(options.url || null)
      .setDescription(
        options.description instanceof Array
          ? options.description.join('\n')
          : options.description || null
      )
      .setThumbnail(options.thumbnail || null)
      .setImage(options.image || null)
      .setFooter(!options.footer ? null : { text: options.footer })
  }

  get embed() {
    return { embeds: [this.message] }
  }
}
