import { Option } from '../commands/common'
import { ChatInputCommandInteraction } from 'discord.js'
import DisTube from 'distube'
import MessageAdapter, { Message } from './messageAdapter'
import MusicAdapter, { MusicPlayer } from './musicAdapter'

export interface CommandInfo {
  name: string
  options: Map<string, Option>
  message: Message
  music: MusicPlayer
}

export class CommandAdapter implements CommandInfo {
  name: string
  options: Map<string, Option>
  readonly message: Message
  readonly music: MusicPlayer

  constructor(interaction: ChatInputCommandInteraction, distube: DisTube) {
    this.name = interaction.commandName
    this.options = this.getOptions(interaction)
    this.message = new MessageAdapter(interaction)
    this.music = new MusicAdapter(distube, this.message)
  }

  getOptions(interaction: ChatInputCommandInteraction) {
    const options = new Map()

    interaction.options.data.forEach((option) => {
      options.set(option.name, option.value)
    })

    return options
  }
}
