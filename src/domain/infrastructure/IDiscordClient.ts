import { Client } from 'discord.js'
import { ICommandHandler } from '../../commandHandler'
import { ILogger } from './ILogger'

export interface IDiscordClient {
  client: Client
  registerEventHandlers: (commandEventHandler: ICommandHandler, logger: ILogger) => void
  login: (token: string) => Promise<void>
}
