import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class EchoCommand extends Command {
  constructor() {
    super('echo')
  }

  async run(commandAdapter: CommandInfo) {
    const message = commandAdapter.options.get('message')
    assert(typeof message === 'string', 'message should be a string')
    await commandAdapter.message.reply(message)
  }
}
