import Command from '../command'
import assert from 'assert'
import { IServiceProvider } from '../domain/services/IServiceProvider'
import type { Option } from '../commandHandler'

export default class QueueCommand extends Command {
  constructor() {
    super('queue', 'Display the song queue.', [
      { name: 'page', type: 'Integer', description: 'The queue page number.', required: false },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, Option>) {
    const page = options.get('page')
    assert(
      page === undefined || typeof page === 'number',
      'if page is defined it should be a number'
    )

    await serviceProvider.message.reply(serviceProvider.music.getQueue(page))
  }
}
