import Command from '../command'
import CommandAdapter, { ICommandAdapter, Option } from '../adapters/commandAdapter'
import type { IDistubeClient } from './distubeClient'
import type { ChatInputCommandInteraction } from 'discord.js'
import type { ILogger } from './logger'

export interface ICommandHandler {
  handle: (
    commandName: string,
    options: Map<string, Option>,
    commandAdapter: ICommandAdapter
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
      CommandAdapter.fromInteraction(interaction, this.distubeClient)
    )
  }

  private static getOptionsFromInteraction(interaction: ChatInputCommandInteraction) {
    const options = new Map()

    interaction.options.data.forEach((option) => {
      options.set(option.name, option.value)
    })

    return options
  }

  public handle(
    commandName: string,
    options: Map<string, Option>,
    commandAdapter: ICommandAdapter
  ) {
    const command = this.commands.get(commandName)
    if (!command) {
      throw new Error(`${commandName} command is not implemented`)
    }

    return command.run(commandAdapter, options)
  }
}
