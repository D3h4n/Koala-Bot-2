import MessageService, { IMessageService } from './messageService'
import MusicService, { IMusicService } from './musicService'
import VoiceService, { IVoiceService } from './voiceService'
import type { ChatInputCommandInteraction } from 'discord.js'
import type { IDistubeClient } from '../infrastructure/distubeClient'

export interface IServiceProvider {
  message: IMessageService
  music: IMusicService
  voice: IVoiceService
}

export default class ServiceProvider implements IServiceProvider {
  readonly message: IMessageService
  readonly music: IMusicService
  readonly voice: IVoiceService

  constructor(
    messageService: IMessageService,
    musicService: IMusicService,
    voiceService: IVoiceService
  ) {
    this.message = messageService
    this.music = musicService
    this.voice = voiceService
  }

  public static fromInteraction(
    interaction: ChatInputCommandInteraction,
    distubeClient: IDistubeClient
  ) {
    return new ServiceProvider(
      new MessageService(interaction),
      new MusicService(interaction, distubeClient),
      new VoiceService(interaction)
    )
  }
}
