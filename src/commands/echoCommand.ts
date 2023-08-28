import Command from '../common'
import { ICommandAdapter } from '../adapters/commandAdapter'
import assert from 'assert'

export default class EchoCommand extends Command {
  constructor() {
    super('echo', 'I repeat whatever you want.', [
      { name: 'message', type: 'STRING', description: 'The message to repeat.' },
    ])
  }

  async run(commandAdapter: ICommandAdapter) {
    const message = commandAdapter.options.get('message')
    assert(typeof message === 'string', 'message should be a string')
    await commandAdapter.message.reply(message)
  }
}
