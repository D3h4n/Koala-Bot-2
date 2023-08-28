import { ChatInputCommandInteraction } from 'discord.js'
import MessageAdapter, { IMessageAdapter } from './messageAdapter'
import MusicAdapter, { IMusicAdapter } from './musicAdapter'
import VoiceAdapter, { IVoiceAdapter } from './voiceAdapter'
import { IDistubeClient } from '../services/distubeClient'

export type Option = string | number | boolean | undefined

export interface ICommandAdapter {
  name: string
  options: Map<string, Option>
  message: IMessageAdapter
  music: IMusicAdapter
  voice: IVoiceAdapter
}

export default class CommandAdapter implements ICommandAdapter {
  readonly name: string
  readonly options: Map<string, Option>
  readonly message: IMessageAdapter
  readonly music: IMusicAdapter
  readonly voice: IVoiceAdapter

  constructor(interaction: ChatInputCommandInteraction, distubeClient: IDistubeClient) {
    this.name = interaction.commandName
    this.options = CommandAdapter.getOptions(interaction)
    this.message = new MessageAdapter(interaction)
    this.music = new MusicAdapter(interaction, distubeClient)
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
