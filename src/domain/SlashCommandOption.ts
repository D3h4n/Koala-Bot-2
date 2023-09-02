import {
  ApplicationCommandOptionType,
  ApplicationCommandOptionAllowedChannelTypes,
} from 'discord.js'

// Fields found on all types of slash commands.
type BaseSlashCommandOption = {
  name: string
  description: string
  required?: boolean
}

// Types of slash commands supported by discord.
type SlashCommandOptionType = keyof typeof ApplicationCommandOptionType

// Select slash command options of specified types.
type SelectType<T, U extends SlashCommandOptionType> = T extends { type: U } ? T : never

// Definition for basic slash command option. i.e only has fields found in BaseSlashCommandOption.
// T should specifies types to be included
type BasicSlashCommandOption<T extends SlashCommandOptionType> = BaseSlashCommandOption & {
  type: T
}

// Definition for complex slash command option. i.e. includes fields other than those found in BaseSlashCommandOption.
// T specifies the type of option
// K specifies addition fields
type SlashCommandOptionWithFields<T extends SlashCommandOptionType, K> = BaseSlashCommandOption &
  K & { type: T }

// Definition of SlashCommandOptions which are not subcommands or subcommand groups.
type NonCommandOptions =
  | BasicSlashCommandOption<'String' | 'Boolean' | 'Integer'>
  | SlashCommandOptionWithFields<
      'Channel',
      {
        channelTypes: ApplicationCommandOptionAllowedChannelTypes[]
      }
    >

// Definition for a slash command option.
export type SlashCommandOption =
  | NonCommandOptions
  | SlashCommandOptionWithFields<
      'Subcommand',
      {
        options?: NonCommandOptions[]
      }
    >
  | SlashCommandOptionWithFields<
      'SubcommandGroup',
      {
        commands?: SelectType<SlashCommandOption, 'Subcommand'>[]
      }
    >
