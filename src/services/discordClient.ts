import { ActivityType, Client, IntentsBitField, TextChannel } from 'discord.js'
import { ICommandHandler } from '../handlers/handleCommandEvent'
import { ICommandAdapterFactory } from './commandAdapterFactory'

export interface IDiscordClient {
  client: Client
  registerEventHandlers: (
    commandEventHandler: ICommandHandler,
    commandAdapterFactory: ICommandAdapterFactory
  ) => void
  login: (token: string) => Promise<void>
}

export default class DiscordClient implements IDiscordClient {
  client: Client<boolean>

  constructor() {
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
      ],
      presence: {
        status: 'online',
        activities: [
          {
            name: 'Making a new bot',
            type: ActivityType.Playing,
          },
        ],
      },
    })
  }

  registerEventHandlers(
    commandHandler: ICommandHandler,
    commandAdapterFactory: ICommandAdapterFactory
  ) {
    this.client
      .on('ready', () => console.log('[INFO] Ready!!!!!!'))
      .on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return

        const command = commandAdapterFactory.fromInteraction(interaction)
        await commandHandler.handle(command)
        console.log(
          `[INFO] User "${interaction.user.tag}" used command "${interaction.commandName}" in ` +
            `channel "${(<TextChannel | null>interaction.channel)?.name}"`
        )
      })
  }

  async login(token: string) {
    this.client.login(token)
  }
}
