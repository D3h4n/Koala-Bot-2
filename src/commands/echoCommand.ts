import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'

export default class EchoCommand extends Command {
  constructor() {
    super('echo')
  }

  async run(commandAdapter: CommandInfo) {
    const message = commandAdapter.options.get('message')
    if (typeof message !== 'string') throw new Error('ERROR: message should be a string')
    await commandAdapter.message.reply(message)
  }
}
