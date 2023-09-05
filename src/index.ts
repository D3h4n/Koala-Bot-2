import dotenv from 'dotenv'
import { readCommands } from './register'
import CommandHandler from './commandHandler'

import MyLogger, { LogLevel } from '@infrastructure/myLogger'
import DiscordClient from '@infrastructure/discordClient'
import DistubeClient from '@infrastructure/distubeClient'
import ServiceProvider from '@services/serviceProvider'

async function main() {
  dotenv.config()
  const discordToken = process.env.DISCORD_BOT_TOKEN ?? ''
  const logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG

  const logger = new MyLogger(logLevel)
  const discordClient = new DiscordClient(logger)
  ServiceProvider.distubeClient = new DistubeClient(discordClient, logger)

  new CommandHandler(readCommands('./src/commands'), discordClient, logger)
  await discordClient.login(discordToken)
}

if (require.main === module) {
  main()
}
