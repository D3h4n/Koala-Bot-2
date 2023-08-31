import Command from '../command'
import assert from 'assert'
import type { ICommandAdapter, Option } from '../adapters/commandAdapter'

export default class QueueCommand extends Command {
  constructor() {
    super('queue', 'Display the song queue.', [
      { name: 'page', type: 'Integer', description: 'The queue page number.', required: false },
    ])
  }

  async run(commandAdapter: ICommandAdapter, options: Map<string, Option>) {
    const page = options.get('page')
    assert(
      page === undefined || typeof page === 'number',
      'if page is defined it should be a number'
    )

    await commandAdapter.message.reply(commandAdapter.music.getQueue(page))
  }
}
