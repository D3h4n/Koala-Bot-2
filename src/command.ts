import {
  ApplicationCommandOptionType,
  PermissionsBitField,
  PermissionsString,
  SlashCommandBuilder,
} from 'discord.js'
import type { ApplicationCommandOptionAllowedChannelTypes } from '@discordjs/builders'
import type { ICommandAdapter, Option } from './adapters/commandAdapter'

type CommandOptionType = keyof typeof ApplicationCommandOptionType

type CommandOption =
  | {
      name: string
      type: Exclude<
        CommandOptionType,
        | 'Subcommand'
        | 'SubcommandGroup'
        | 'User'
        | 'Channel'
        | 'Role'
        | 'Mentionable'
        | 'Number'
        | 'Attachment'
      >
      description: string
      required?: boolean
    }
  | {
      name: string
      type: 'Channel'
      description: string
      required?: boolean
      channelTypes: ApplicationCommandOptionAllowedChannelTypes[]
    }

export default abstract class Command {
  readonly name: string
  readonly description: string
  readonly options: CommandOption[]
  readonly permissions: PermissionsString[]

  protected constructor(
    name: string,
    description: string,
    options: CommandOption[] = [],
    permissions: PermissionsString[] = []
  ) {
    this.name = name
    this.description = description
    this.options = options
    this.permissions = permissions
  }

  abstract run(commandAdapter: ICommandAdapter, options?: Map<string, Option>): Promise<void>

  public toSlashCommand(): SlashCommandBuilder {
    const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description)

    if (this.permissions.length > 0) {
      command.setDefaultMemberPermissions(new PermissionsBitField().add(this.permissions).bitfield)
    }

    Command.addSlashCommandOptions(command, this.options)

    return command
  }

  private static addSlashCommandOptions(command: SlashCommandBuilder, options: CommandOption[]) {
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

        default:
          throw new Error(`Unhandled option type "${option.type}"`)
      }
    }
  }
}
