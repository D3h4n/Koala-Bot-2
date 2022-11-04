import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'

export default class QueueCommand extends Command {
  constructor() {
    super('queue')
  }

  async run(commandAdapter: CommandInfo) {
    const page = commandAdapter.options.get('page')
    if (page != undefined && typeof page !== 'number')
      throw new Error('ERROR: if page is defined it should be a number')
    await commandAdapter.music.queue(page)
  }
}
