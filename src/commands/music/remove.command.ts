import assert from 'assert'
import Command from 'src/command'
import CommandOption from '@domain/CommandOption'
import IServiceProvider from '@domain/IServiceProvider'

export default class RemoveCommand extends Command {
  constructor() {
    super('remove', 'Remove a song from the queue.', [
      { name: 'position', type: 'Integer', description: 'The position of the song to remove.' },
    ])
  }
  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const position = options.get('position')
    assert(typeof position === 'number', 'position should always be a number')
    const result = await serviceProvider.music.remove(position)
    await serviceProvider.message.reply(result.value())
  }
}
