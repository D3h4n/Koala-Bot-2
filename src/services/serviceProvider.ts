import type { ChatInputCommandInteraction } from 'discord.js'

import { IMusicService } from '../domain/services/IMusicService'
import { IVoiceService } from '../domain/services/IVoiceService'
import { IMessageService } from '../domain/services/IMessageService'
import { IServiceProvider } from '../domain/services/IServiceProvider'
import type { IDistubeClient } from 'src/domain/infrastructure/IDistubeClient'

import MessageService from './messageService'
import MusicService from './musicService'
import VoiceService from './voiceService'

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
