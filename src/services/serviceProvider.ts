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
  private static _distubeClient: IDistubeClient

  constructor(
    messageService: IMessageService,
    musicService: IMusicService,
    voiceService: IVoiceService
  ) {
    this.message = messageService
    this.music = musicService
    this.voice = voiceService
  }

  static set distubeClient(distubeClient: IDistubeClient) {
    ServiceProvider._distubeClient = distubeClient
  }

  public static fromInteraction(interaction: ChatInputCommandInteraction) {
    if (!ServiceProvider._distubeClient) {
      throw new Error('Distube Client not initialized')
    }

    return new ServiceProvider(
      new MessageService(interaction),
      new MusicService(interaction, ServiceProvider._distubeClient),
      new VoiceService(interaction)
    )
  }
}
