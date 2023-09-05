import type { ChatInputCommandInteraction, TextChannel } from 'discord.js'

import IInteractionProducer from '@domain/IInteractionProducter'
import type IDistubeClient from '@domain/IDistubeClient'
import IServiceProvider from '@domain/IServiceProvider'
import CommandOption from '@domain/CommandOption'
import type ILogger from '@domain/ILogger'

import Command from 'src/command'
import ServiceProvider from '@services/serviceProvider'

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
