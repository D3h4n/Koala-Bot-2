import * as assert from "assert";

interface MessageReplier {
  reply: (string) => void
}

export function executeCommand(
    name: string, options: Record<string, string | undefined>, replier: MessageReplier
) {
  if (name === "echo") {
    assert.ok(options['message'], "ERROR: Echo command should always have message option")
    assert.equal(
      typeof options['message'],
      'string',
      "ERROR: Message option for echo command should always be a string"
    )
    replier.reply(options['message'])
  }

  if (name === "choose") {
    const choices = Object
        .entries(options)
        .filter(([key, value]) => key.match(/choice[1-9]/) && typeof value === 'string')
        .map((entry) => <string>entry[1])

    const idx = Math.floor(Math.random() * choices.length)
    replier.reply(`\`${choices[idx]}\``)
  }
}
