import { EmbedBuilder } from 'discord.js'

interface IEmbedOptions {
  author?: string
  icon?: string
  title?: string
  url?: string
  description?: string
  thumbnail?: string
  footer?: string
}

export default class EmbeddedMessage {
  readonly #builder: EmbedBuilder

  constructor(options: IEmbedOptions) {
    this.#builder = new EmbedBuilder()
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

  get embed() {
    return this.#builder
  }
}
