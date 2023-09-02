import type { ChatInputCommandInteraction, TextChannel } from 'discord.js'

import type IDistubeClient from './domain/infrastructure/IDistubeClient'
import IServiceProvider from './domain/services/IServiceProvider'
import type ILogger from './domain/infrastructure/ILogger'

import Command from './command'
import ServiceProvider from './services/serviceProvider'
import { CommandOption } from './domain/CommandOption'
import IInteractionProducer from './domain/infrastructure/IInteractionProducter'

export default class CommandHandler {
  private readonly commands: Map<string, Command>

  constructor(
    commands: Command[],
    interactionProvider?: IInteractionProducer,
    distubeClient?: IDistubeClient,
    logger?: ILogger
  ) {
    this.commands = new Map(
      commands.map((command) => {
        return [command.name, command]
      })
    )

    distubeClient?.registerEventHandlers(logger)
    interactionProvider?.registerCommandHandler(
      async (interaction: ChatInputCommandInteraction) => {
        if (!distubeClient) {
          logger?.error('Cannot handle interaction without distube client set')
          return
        }

        logger?.info(
          `User '${interaction.user.tag}' used command '${interaction.commandName}' ` +
            `in channel '${(<TextChannel | null>interaction.channel)?.name}'`
        )

        await this.handle(
          interaction.commandName,
          new Map(interaction.options.data.map((option) => [option.name, option.value])),
          ServiceProvider.fromInteraction(interaction, distubeClient)
        )
      },
      logger
    )
  }

  public async handle(
    commandName: string,
    options: Map<string, CommandOption>,
    serviceProvider: IServiceProvider
  ) {
    const command = this.commands.get(commandName)
    if (!command) {
      throw new Error(`${commandName} command is not implemented`)
    }

    await command.run(serviceProvider, options)
  }
}
