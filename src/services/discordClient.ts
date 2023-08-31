import { ActivityType, Client, IntentsBitField, TextChannel } from 'discord.js'
import { ICommandHandler } from './commandHandler'
import { ILogger } from './logger'

export interface IDiscordClient {
  client: Client
  registerEventHandlers: (commandEventHandler: ICommandHandler, logger: ILogger) => void
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

  registerEventHandlers(commandHandler: ICommandHandler, logger: ILogger) {
    this.client
      .on('ready', () => logger.info('Running'))
      .on('interactionCreate', async (interaction) => {
        logger.info(`Received interaction ${interaction.id}`)
        if (!interaction.isChatInputCommand() || !interaction.guildId) return

        await commandHandler.handleInteraction(interaction)
        logger.info(
          `User "${interaction.user.tag}" used command "${interaction.commandName}" in ` +
            `channel "${(<TextChannel | null>interaction.channel)?.name}"`
        )
      })
  }

  async login(token: string) {
    this.client.login(token)
  }
}
