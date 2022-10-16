import * as assert from 'assert'

interface MessageReplier {
  reply: (string) => void
}

function echoCommand(
  options: Record<string, string | undefined>,
  replier: MessageReplier
) {
  const message = options['message']
  assert.ok(message, 'ERROR: Echo command should always have message option')
  assert.equal(
    typeof message,
    'string',
    'ERROR: Message option for echo command should always be a string'
  )
  replier.reply(message)
}

function chooseCommand(
  options: Record<string, string | undefined>,
  replier: MessageReplier
) {
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
  options: Record<string, string | undefined>,
  replier: MessageReplier
) {
  switch (name) {
    case 'echo':
      echoCommand(options, replier)
      break

    case 'choose':
      chooseCommand(options, replier)
      break

    case 'default':
      break
  }
}
