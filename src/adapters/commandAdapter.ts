import { ChatInputCommandInteraction } from 'discord.js'
import DisTube from 'distube'
import MessageAdapter, { Message } from './messageAdapter'
import MusicAdapter, { Music } from './musicAdapter'
import VoiceAdapter, { Voice } from './voiceAdapter'

export type Option = string | number | boolean | undefined

export interface CommandInfo {
  name: string
  options: Map<string, Option>
  message: Message
  music: Music
  voice: Voice
}

export class CommandAdapter implements CommandInfo {
  name: string
  options: Map<string, Option>
  readonly message: Message
  readonly music: Music
  readonly voice: Voice

  constructor(interaction: ChatInputCommandInteraction, distube: DisTube) {
    this.name = interaction.commandName
    this.options = CommandAdapter.getOptions(interaction)
    this.message = new MessageAdapter(interaction)
    this.music = new MusicAdapter(interaction, distube)
    this.voice = new VoiceAdapter(interaction)
  }

  static getOptions(interaction: ChatInputCommandInteraction) {
    const options = new Map()

    interaction.options.data.forEach((option) => {
      options.set(option.name, option.value)
    })

    return options
  }
}
