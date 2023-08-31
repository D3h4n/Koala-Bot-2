import Command from '../command'
import CommandAdapter, { ICommandAdapter } from '../adapters/commandAdapter'
import { IDistubeClient } from './distubeClient'
import { ChatInputCommandInteraction } from 'discord.js'
import { ILogger } from './logger'

export interface ICommandHandler {
  handle: (commandName, commandAdapter: ICommandAdapter) => Promise<void>
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
      CommandAdapter.fromInteraction(interaction, this.distubeClient)
    )
  }

  public handle(commandName: string, commandAdapter: ICommandAdapter) {
    const command = this.commands.get(commandName)
    if (!command) {
      throw new Error(`${commandName} command is not implemented`)
    }

    return command.run(commandAdapter)
  }
}
