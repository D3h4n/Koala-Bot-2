import Command from '../command'
import assert from 'assert'
import type { ICommandAdapter, Option } from '../adapters/commandAdapter'

export default class EchoCommand extends Command {
  constructor() {
    super('echo', 'I repeat whatever you want.', [
      { name: 'message', type: 'String', description: 'The message to repeat.' },
    ])
  }

  async run(commandAdapter: ICommandAdapter, options: Map<string, Option>) {
    const message = options.get('message')
    assert(typeof message === 'string', 'message should be a string')
    await commandAdapter.message.reply(message)
  }
}
