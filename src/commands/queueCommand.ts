import Command from '../common'
import { ICommandAdapter } from '../adapters/commandAdapter'
import assert from 'assert'

export default class QueueCommand extends Command {
  constructor() {
    super('queue', 'Display the song queue.', [
      { name: 'page', type: 'INTEGER', description: 'The queue page number.', required: false },
    ])
  }

  async run(commandAdapter: ICommandAdapter) {
    const page = commandAdapter.options.get('page')
    assert(
      page === undefined || typeof page === 'number',
      'if page is defined it should be a number'
    )

    await commandAdapter.message.reply(commandAdapter.music.getQueue(page))
  }
}
