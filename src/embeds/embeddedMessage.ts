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
  readonly options: IEmbedOptions

  constructor(options: IEmbedOptions) {
    this.options = options
  }

  get embed() {
    return new EmbedBuilder()
      .setAuthor(
        this.options.author
          ? {
              name: this.options.author,
              iconURL: this.options.icon,
            }
          : null
      )
      .setTitle(this.options.title || null)
      .setURL(this.options.url || null)
      .setDescription(
        this.options.description instanceof Array
          ? this.options.description.join('\n')
          : this.options.description || null
      )
      .setThumbnail(this.options.thumbnail || null)
      .setImage(this.options.image || null)
      .setFooter(!this.options.footer ? null : { text: this.options.footer })
  }
}
