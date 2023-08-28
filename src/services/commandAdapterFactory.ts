import { ChatInputCommandInteraction } from 'discord.js'
import CommandAdapter, { ICommandAdapter } from '../adapters/commandAdapter'
import { IDistubeClient } from './distubeClient'

export interface ICommandAdapterFactory {
  fromInteraction: (interaction: ChatInputCommandInteraction) => ICommandAdapter
}

export default class CommandAdapterFactory implements ICommandAdapterFactory {
  distubeClient: IDistubeClient

  constructor(distubeClient: IDistubeClient) {
    this.distubeClient = distubeClient
  }

  fromInteraction(interaction: ChatInputCommandInteraction): ICommandAdapter {
    return new CommandAdapter(interaction, this.distubeClient)
  }
}
