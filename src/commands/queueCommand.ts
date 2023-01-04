import Command from '../common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class QueueCommand extends Command {
  constructor() {
    super('queue', 'Display the song queue.', [
      { name: 'page', type: 'INTEGER', description: 'The queue page number.', required: false },
    ])
  }

  async run(commandAdapter: CommandInfo) {
    const page = commandAdapter.options.get('page')
    assert(
      page === undefined || typeof page === 'number',
      'if page is defined it should be a number'
    )
    const embed = commandAdapter.music.queue(page)
    await commandAdapter.message.reply(embed)
  }
}
