import fs from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'
import { Client } from 'discord.js'

import type Command from 'command'
import MyLogger from 'infrastructure/myLogger'

async function main() {
  dotenv.config()
  const token = process.env.DISCORD_BOT_TOKEN
  const logger = new MyLogger()

  if (!token) throw new Error('Missing Registration Credentials')

  const commands = readCommands('./src/commands')

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

export function readCommands(dir: string): Command[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return findCommandsInDirectory(dir).map((path) => new (require(path).default)())
}

function findCommandsInDirectory(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirEntry) => {
      const path = resolve(dirEntry.path, dirEntry.name)
      return !dirEntry.isDirectory() ? path : findCommandsInDirectory(path)
    })
    .filter((path) => path.endsWith('.ts'))
}

if (require.main === module) {
  main()
}
