import assert from 'assert'
import Command from 'src/command'
import type CommandOption from '@domain/CommandOption'
import type IServiceProvider from '@domain/IServiceProvider'

export default class QueueCommand extends Command {
  constructor() {
    super('queue', 'Display the song queue.', [
      { name: 'page', type: 'Integer', description: 'The queue page number.', required: false },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const page = options.get('page')
    assert(
      page === undefined || typeof page === 'number',
      'if page is defined it should be a number'
    )

    await serviceProvider.message.reply(serviceProvider.music.getQueue(page))
  }
}
