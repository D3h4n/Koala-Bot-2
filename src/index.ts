import dotenv from 'dotenv'
import { readCommands } from './register'
import DistubeClient from './services/distubeClient'
import CommandHandler from './handlers/handleCommandEvent'
import DiscordClient from './services/discordClient'

async function main() {
  dotenv.config()
  const discordToken = process.env.DISCORD_BOT_TOKEN ?? ''
  const youtubeAPIKey = process.env.YOUTUBE_API_KEY

  const discordClient = new DiscordClient()
  const distubeClient = new DistubeClient(discordClient, youtubeAPIKey)
  const commandHandler = new CommandHandler(readCommands('./dist/commands'))

  distubeClient.registerEventHandlers()
  discordClient.registerEventHandlers(commandHandler, distubeClient)
  await discordClient.login(discordToken)
}

if (require.main === module) {
  main()
}
