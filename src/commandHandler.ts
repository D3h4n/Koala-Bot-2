import type { ChatInputCommandInteraction } from 'discord.js'

import type { IDistubeClient } from './domain/infrastructure/IDistubeClient'
import { IServiceProvider } from './domain/services/IServiceProvider'
import type { ILogger } from './domain/infrastructure/ILogger'

import Command from './command'
import ServiceProvider from './services/serviceProvider'

export type Option = string | number | boolean | undefined

export interface ICommandHandler {
  handle: (
    commandName: string,
    options: Map<string, Option>,
    serviceProvider: IServiceProvider
  ) => Promise<void>
  handleInteraction: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export default class CommandHandler implements ICommandHandler {
  private readonly commands: Map<string, Command>
  private readonly distubeClient?: IDistubeClient
  private readonly logger?: ILogger

  constructor(commands: Command[], distubeClient?: IDistubeClient, logger?: ILogger) {
    this.commands = new Map(
      commands.map((command) => {
        return [command.name, command]
      })
    )
    this.distubeClient = distubeClient
    this.logger = logger
  }

  public async handleInteraction(interaction: ChatInputCommandInteraction) {
    if (!this.distubeClient) {
      this.logger?.error('Cannot handle interaction without distube client set')
      return
    }

    this.handle(
      interaction.commandName,
      CommandHandler.getOptionsFromInteraction(interaction),
      ServiceProvider.fromInteraction(interaction, this.distubeClient)
    )
  }

  private static getOptionsFromInteraction(interaction: ChatInputCommandInteraction) {
    return new Map(interaction.options.data.map((option) => [option.name, option.value]))
  }

  public async handle(
    commandName: string,
    options: Map<string, Option>,
    serviceProvider: IServiceProvider
  ) {
    const command = this.commands.get(commandName)
    if (!command) {
      throw new Error(`${commandName} command is not implemented`)
    }

    await command.run(serviceProvider, options)
  }
}
