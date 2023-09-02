import {
  PermissionsBitField,
  PermissionsString,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'
import type { IServiceProvider } from './domain/services/IServiceProvider'
import { SlashCommandOption } from './domain/SlashCommandOption'
import { Option } from './commandHandler'

export default abstract class Command {
  readonly name: string
  readonly description: string
  readonly options: SlashCommandOption[]
  readonly permissions: PermissionsString[]

  protected constructor(
    name: string,
    description: string,
    options: SlashCommandOption[] = [],
    permissions: PermissionsString[] = []
  ) {
    this.name = name
    this.description = description
    this.options = options
    this.permissions = permissions
  }

  abstract run(serviceProvider: IServiceProvider, options?: Map<string, Option>): Promise<void>

  public toSlashCommand(): SlashCommandBuilder {
    const command = Command.addSlashCommandOptions(new SlashCommandBuilder(), this.options)
      .setName(this.name)
      .setDescription(this.description)

    if (this.permissions.length > 0) {
      command.setDefaultMemberPermissions(new PermissionsBitField().add(this.permissions).bitfield)
    }

    return command
  }

  private static addSlashCommandOptions<
    T extends SlashCommandBuilder | SlashCommandSubcommandBuilder
  >(command: T, options?: SlashCommandOption[]): T {
    if (!options) return command

    for (const option of options) {
      switch (option.type) {
        case 'String':
          command.addStringOption((builder) =>
            builder
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? true)
          )
          break

        case 'Integer':
          command.addIntegerOption((builder) =>
            builder
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? true)
          )
          break

        case 'Channel':
          command.addChannelOption((builder) =>
            builder
              .setName(option.name)
              .setDescription(option.description)
              .addChannelTypes(...option.channelTypes)
              .setRequired(option.required ?? true)
          )
          break

        case 'Subcommand':
          if (command instanceof SlashCommandSubcommandBuilder)
            throw new Error('Cannot nest subcommands, use Subcommand Group instead.')

          command.addSubcommand((builder) =>
            Command.addSlashCommandOptions(builder, option.options)
              .setName(option.name)
              .setDescription(option.description)
          )
          break

        default:
          throw new Error(`Unhandled option type "${option.type}"`)
      }
    }

    return command
  }
}
