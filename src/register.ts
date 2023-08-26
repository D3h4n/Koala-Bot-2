import fs from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'

import type Command from './common'
import { Client } from 'discord.js'

async function main() {
  dotenv.config()
  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) throw new Error('Missing Registration Credentials')

  const commands = readCommands('./dist/commands')

  const client = new Client({ intents: [] })
  client
    .on('ready', async () => {
      console.log(`[INFO] Registering ${commands.length} commands`)

      const result = await client.application?.commands.set(
        commands.map((command) => command.toSlashCommand())
      )

      if (!result || result.size !== commands.length) {
        console.error(`[FAIL] Failed to register all commands`)
        process.exit(3)
      }

      console.log(`[INFO] Successfully registered ${result.size} commands`)
      process.exit(0)
    })
    .login(token)
}

export function readCommands(dir: string): Command[] {
  const commands: Command[] = []

  for (const f of findFilesInDirectory(dir)) {
    // NOTE: we're searching for js files because everything is being transpiled to js.
    if (f.endsWith('.js')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command: Command = new (require(f).default)()
      commands.push(command)
    }
  }

  return commands
}

function* findFilesInDirectory(dir: string): Generator<string, void, void> {
  const dirEntries = fs.readdirSync(dir, { withFileTypes: true })

  for (const dirEntry of dirEntries) {
    const path = resolve(dir, dirEntry.name)

    if (dirEntry.isDirectory()) {
      yield* findFilesInDirectory(path)
    } else {
      yield path
    }
  }
}

if (require.main === module) {
  main()
}
