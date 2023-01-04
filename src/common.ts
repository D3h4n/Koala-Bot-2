import { CommandInfo } from './adapters/commandAdapter'
import { PermissionsString } from 'discord.js'

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

export interface CommandOption {
  name: string
  type: CommandOptionType
  description: string
  required?: boolean
}

export default abstract class Command {
  readonly name: string
  readonly description: string
  readonly options?: CommandOption[]
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

  abstract run(commandAdapter: CommandInfo): Promise<void>
}
