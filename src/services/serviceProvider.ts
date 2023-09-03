import type { ChatInputCommandInteraction } from 'discord.js'

import type IMusicService from '@domain/IMusicService'
import type IVoiceService from '@domain/IVoiceService'
import type IDistubeClient from '@domain/IDistubeClient'
import type IMessageService from '@domain/IMessageService'
import type IServiceProvider from '@domain/IServiceProvider'

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
