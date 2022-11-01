import * as assert from 'assert'
import { EmbedAdapter } from './adapters/MessageAdapter'
import Adapter from './adapters/Adapter'

type Options = Record<string, string | number | undefined>

export interface MusicPlayer {
  play: (string) => Promise<void>
  stop: () => Promise<void>
  queue: (int?) => Promise<void>
  skip: () => Promise<void>
  shuffle: () => Promise<void>
}

export interface MessageReplier {
  reply: (message: string) => Promise<void>
  replyWithEmbed: (embed: EmbedAdapter) => Promise<void>
}

function echoCommand(options: Options, replier: MessageReplier) {
  const message = options['message']
  assert.ok(message, 'ERROR: Echo command should always have message option')
  assert.equal(
    typeof message,
    'string',
    'ERROR: Message option for echo command should always be a string'
  )
  replier.reply(message as string)
}

function chooseCommand(options: Options, replier: MessageReplier) {
  const choices = Object.entries(options)
    .filter(
      ([key, value]) => key.match(/choice[1-9]/) && typeof value === 'string'
    )
    .map((entry) => <string>entry[1])

  assert.ok(
    choices.length >= 2,
    'ERROR: There should always be at least 2 choices'
  )

  const idx = Math.floor(Math.random() * choices.length)
  replier.reply(`\`${choices[idx]}\``)
}

export function executeCommand(
  name: string,
  options: Options,
  adapter: Adapter
) {
  switch (name) {
    case 'echo':
      echoCommand(options, adapter.messageReplier)
      break

    case 'choose':
      chooseCommand(options, adapter.messageReplier)
      break

    case 'play':
      adapter.musicPlayer.play(options['song'])
      break

    case 'stop':
      adapter.musicPlayer.stop()
      break

    case 'queue':
      adapter.musicPlayer.queue(options['page'])
      break

    case 'skip':
      adapter.musicPlayer.skip()
      break

    case 'shuffle':
      adapter.musicPlayer.shuffle()
      break

    case 'default':
      break
  }
}
