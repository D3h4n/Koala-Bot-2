import dotenv from 'dotenv'
import { readCommands } from './register'
import DistubeClient from './services/distubeClient'
import CommandHandler from './services/commandHandler'
import DiscordClient from './services/discordClient'
import MyLogger from './services/logger'

async function main() {
  dotenv.config()
  const discordToken = process.env.DISCORD_BOT_TOKEN ?? ''
  const youtubeAPIKey = process.env.YOUTUBE_API_KEY

  const discordClient = new DiscordClient()
  const distubeClient = new DistubeClient(discordClient, youtubeAPIKey)
  const commandHandler = new CommandHandler(readCommands('./dist/commands'), distubeClient)
  const logger = new MyLogger()

  distubeClient.registerEventHandlers(logger)
  discordClient.registerEventHandlers(commandHandler, logger)
  await discordClient.login(discordToken)
}

if (require.main === module) {
  main()
}
