import { ActivityType, ChatInputCommandInteraction, Client, IntentsBitField } from 'discord.js'

import type ILogger from '@domain/ILogger'
import type IClientProvider from '@domain/IClientProvider'
import type IInteractionProducer from '@domain/IInteractionProducter'

export default class DiscordClient implements IInteractionProducer, IClientProvider {
  private readonly discordClient: Client<boolean>

  constructor() {
    this.discordClient = new Client({
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

  get client() {
    return this.discordClient
  }

  registerCommandHandler(
    handler: (interaction: ChatInputCommandInteraction) => void,
    logger?: ILogger
  ) {
    this.client
      .on('ready', () => logger?.info('Running'))
      .on('interactionCreate', (interaction) => {
        logger?.debug(`Received interaction ${interaction.id}`)
        if (!interaction.isChatInputCommand() || !interaction.guildId) return
        handler(interaction)
      })
  }

  async login(token: string) {
    this.client.login(token)
  }
}
