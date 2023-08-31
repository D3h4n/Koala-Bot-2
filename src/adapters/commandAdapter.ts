import MessageAdapter, { IMessageAdapter } from './messageAdapter'
import MusicAdapter, { IMusicAdapter } from './musicAdapter'
import VoiceAdapter, { IVoiceAdapter } from './voiceAdapter'
import type { ChatInputCommandInteraction } from 'discord.js'
import type { IDistubeClient } from '../services/distubeClient'

export type Option = string | number | boolean | undefined

export interface ICommandAdapter {
  options: Map<string, Option>
  message: IMessageAdapter
  music: IMusicAdapter
  voice: IVoiceAdapter
}

export default class CommandAdapter implements ICommandAdapter {
  readonly options: Map<string, Option>
  readonly message: IMessageAdapter
  readonly music: IMusicAdapter
  readonly voice: IVoiceAdapter

  constructor(
    options: Map<string, Option>,
    messageAdapter: IMessageAdapter,
    musicAdapter: IMusicAdapter,
    voiceAdapter: IVoiceAdapter
  ) {
    this.options = options
    this.message = messageAdapter
    this.music = musicAdapter
    this.voice = voiceAdapter
  }

  private static getOptionsFromInteraction(interaction: ChatInputCommandInteraction) {
    const options = new Map()

    interaction.options.data.forEach((option) => {
      options.set(option.name, option.value)
    })

    return options
  }

  public static fromInteraction(
    interaction: ChatInputCommandInteraction,
    distubeClient: IDistubeClient
  ) {
    const message = new MessageAdapter(interaction)
    const music = new MusicAdapter(interaction, distubeClient)
    const voice = new VoiceAdapter(interaction)

    return new CommandAdapter(
      CommandAdapter.getOptionsFromInteraction(interaction),
      message,
      music,
      voice
    )
  }
}
