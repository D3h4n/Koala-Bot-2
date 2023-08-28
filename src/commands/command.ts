import { ICommandAdapter } from '../adapters/commandAdapter'
import {
  ApplicationCommandOptionType,
  PermissionsBitField,
  PermissionsString,
  SlashCommandBuilder,
} from 'discord.js'
import { ApplicationCommandOptionAllowedChannelTypes } from '@discordjs/builders'

type CommandOptionType = keyof typeof ApplicationCommandOptionType

interface ICommandOption {
  name: string
  type: CommandOptionType
  description: string
  required?: boolean
  channelTypes?: ApplicationCommandOptionAllowedChannelTypes[]
}

export default abstract class Command {
  readonly name: string
  readonly description: string
  readonly options: ICommandOption[]
  readonly permissions: PermissionsString[]

  protected constructor(
    name: string,
    description: string,
    options: ICommandOption[] = [],
    permissions: PermissionsString[] = []
  ) {
    this.name = name
    this.description = description
    this.options = options
    this.permissions = permissions
  }

  abstract run(commandAdapter: ICommandAdapter): Promise<void>

  toSlashCommand(): SlashCommandBuilder {
    const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description)

    if (this.permissions.length > 0) {
      command.setDefaultMemberPermissions(new PermissionsBitField().add(this.permissions).bitfield)
    }

    Command.addSlashCommandOptions(command, this.options)

    return command
  }

  private static addSlashCommandOptions(command: SlashCommandBuilder, options: ICommandOption[]) {
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
          command.addChannelOption((builder) => {
            builder
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? true)

            if (option.channelTypes) {
              builder.addChannelTypes(...option.channelTypes)
            }

            return builder
          })
          break

        default:
          throw new Error(`Unhandled option type "${option.type}"`)
      }
    }
  }
}
