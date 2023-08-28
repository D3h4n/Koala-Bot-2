import { ActivityType, Client, IntentsBitField, TextChannel } from 'discord.js'
import CommandAdapter from '../adapters/commandAdapter'
import { ICommandHandler } from '../handlers/handleCommandEvent'
import { IDistubeClient } from './distubeClient'

export interface IDiscordClient {
  client: Client
  registerEventHandlers: (
    commandEventHandler: ICommandHandler,
    distubeClient: IDistubeClient
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

  registerEventHandlers(commandHandler: ICommandHandler, distubeClient: IDistubeClient) {
    this.client
      .on('ready', () => console.log('[INFO] Ready!!!!!!'))
      .on('interactionCreate', (interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return
        const command = new CommandAdapter(interaction, distubeClient)

        commandHandler.handle(command)
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
