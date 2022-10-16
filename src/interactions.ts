import * as assert from "assert";

interface MessageReplier {
  reply: (string) => void
}

export function handleCommand(
    name: string, options: Record<string, string | undefined>, replier: MessageReplier
) {
  if (name == "echo") {
    assert.ok(options['message'], "ERROR: Echo command should always have message option")
    assert.equal(
      typeof options['message'],
      'string',
      "ERROR: Message option for echo command should always be a string"
    )
    replier.reply(options['message'])
  }
}
