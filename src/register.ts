import fs from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'
import { Routes } from 'discord-api-types/v10'
import { REST } from '@discordjs/rest'

import type Command from './common'

async function main() {
  dotenv.config()
  const token = process.env.DISCORD_BOT_TOKEN
  const clientID = process.env.CLIENT_ID
  if (!token || !clientID) throw new Error('Missing Registration Credentials')

  const commands = readCommands('./dist/commands')
  const rest = new REST().setToken(token)

  await registerApplicationCommands(rest, clientID, commands)
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

async function registerApplicationCommands(
  rest: REST,
  clientID: string,
  commands: Command[]
): Promise<void> {
  await rest.put(Routes.applicationCommands(clientID), {
    body: commands.map((command) => command.toSlashCommand().toJSON()),
  })
}

if (require.main === module) {
  main()
}
