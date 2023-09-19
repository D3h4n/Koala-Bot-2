import dotenv from 'dotenv'
import { Client } from 'discord.js'

import MyLogger from '@infrastructure/myLogger'
import commands from './commands'

async function main() {
  dotenv.config()
  const token = process.env.DISCORD_BOT_TOKEN
  const logger = new MyLogger()

  if (!token) throw new Error('Missing Registration Credentials')

  const client = new Client({ intents: [] })
  client
    .on('ready', async () => {
      logger.info(`Registering ${commands.length} commands`)

      const result = await client.application?.commands.set(
        commands.map((command) => command.toSlashCommand())
      )

      if (!result || result.size !== commands.length) {
        logger.error('Failed to register all commands')
        process.exit(3)
      }

      logger.info(`Successfully registered ${result.size} commands`)
      process.exit(0)
    })
    .login(token)
}

if (require.main === module) {
  main()
}
