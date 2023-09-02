import dotenv from 'dotenv'
import { readCommands } from './register'
import CommandHandler from './commandHandler'

import MyLogger from './infrastructure/logger'
import DiscordClient from './infrastructure/discordClient'
import DistubeClient from './infrastructure/distubeClient'

async function main() {
  dotenv.config()
  const discordToken = process.env.DISCORD_BOT_TOKEN ?? ''
  const youtubeAPIKey = process.env.YOUTUBE_API_KEY

  const discordClient = new DiscordClient()
  new CommandHandler(
    readCommands('./dist/commands'),
    discordClient,
    new DistubeClient(discordClient, youtubeAPIKey),
    new MyLogger()
  )
  await discordClient.login(discordToken)
}

if (require.main === module) {
  main()
}
