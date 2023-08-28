import { ICommandAdapter } from './adapters/commandAdapter'
import {
  PermissionFlagsBits,
  PermissionsBitField,
  PermissionsString,
  SlashCommandBuilder,
} from 'discord.js'
import { ApplicationCommandOptionAllowedChannelTypes } from '@discordjs/builders'

export const ECommandOptionType = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10,
  ATTACHMENT: 11,
} as const

type CommandOptionType = keyof typeof ECommandOptionType

export interface ICommandOption {
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
    const command = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .setDefaultMemberPermissions(
        this.permissions.reduce(
          (prev, curr) => prev | PermissionFlagsBits[curr],
          PermissionsBitField.Default
        )
      )
    Command.addSlashCommandOptions(command, this.options)

    return command
  }

  private static addSlashCommandOptions(command: SlashCommandBuilder, options: ICommandOption[]) {
    for (const option of options) {
      switch (option.type) {
        case 'STRING':
          command.addStringOption((builder) =>
            builder
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? true)
          )
          break

        case 'INTEGER':
          command.addIntegerOption((builder) =>
            builder
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? true)
          )
          break

        case 'CHANNEL':
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
