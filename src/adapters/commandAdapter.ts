import MessageAdapter, { IMessageAdapter } from './messageAdapter'
import MusicAdapter, { IMusicAdapter } from './musicAdapter'
import VoiceAdapter, { IVoiceAdapter } from './voiceAdapter'
import type { ChatInputCommandInteraction } from 'discord.js'
import type { IDistubeClient } from '../services/distubeClient'

export type Option = string | number | boolean | undefined

export interface ICommandAdapter {
  message: IMessageAdapter
  music: IMusicAdapter
  voice: IVoiceAdapter
}

export default class CommandAdapter implements ICommandAdapter {
  readonly message: IMessageAdapter
  readonly music: IMusicAdapter
  readonly voice: IVoiceAdapter

  constructor(
    messageAdapter: IMessageAdapter,
    musicAdapter: IMusicAdapter,
    voiceAdapter: IVoiceAdapter
  ) {
    this.message = messageAdapter
    this.music = musicAdapter
    this.voice = voiceAdapter
  }

  public static fromInteraction(
    interaction: ChatInputCommandInteraction,
    distubeClient: IDistubeClient
  ) {
    return new CommandAdapter(
      new MessageAdapter(interaction),
      new MusicAdapter(interaction, distubeClient),
      new VoiceAdapter(interaction)
    )
  }
}
