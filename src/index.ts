import dotenv from 'dotenv'
import { readCommands } from 'register'
import CommandHandler from 'commandHandler'

import MyLogger from 'infrastructure/myLogger'
import DiscordClient from 'infrastructure/discordClient'
import DistubeClient from 'infrastructure/distubeClient'

async function main() {
  dotenv.config()
  const discordToken = process.env.DISCORD_BOT_TOKEN ?? ''

  const discordClient = new DiscordClient()
  new CommandHandler(
    readCommands('./src/commands'),
    discordClient,
    new DistubeClient(discordClient),
    new MyLogger()
  )
  await discordClient.login(discordToken)
}

if (require.main === module) {
  main()
}
