import { ActivityType, Client, IntentsBitField } from 'discord.js'

import type ILogger from '@domain/ILogger'
import type IClientProvider from '@domain/IClientProvider'
import { InteractionHandler } from '@domain/IInteractionProducter'
import type IInteractionProducer from '@domain/IInteractionProducter'

export default class DiscordClient implements IInteractionProducer, IClientProvider {
  private readonly client: Client<boolean>
  private readonly handlers: Set<InteractionHandler>
  private readonly logger?: ILogger

  constructor(logger?: ILogger) {
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

    this.handlers = new Set()

    this.client
      .on('ready', () => logger?.info('Running'))
      .on('interactionCreate', (interaction) => {
        logger?.debug(`Received interaction ${interaction.id}`)
        if (!interaction.isChatInputCommand() || !interaction.guildId) return
        this.handlers.forEach((handler) => handler(interaction))
      })
  }

  getClient() {
    return this.client
  }

  subscribe(handler: InteractionHandler) {
    this.logger?.debug('Adding new handler')
    this.handlers.add(handler)
  }

  login(token: string) {
    this.logger?.debug(`Logging in with token ${token}`)
    return this.client.login(token)
  }
}
