import assert from 'assert'
import Command from 'src/command'
import CommandOption from '@domain/CommandOption'
import IServiceProvider from '@domain/services/IServiceProvider'

export default class SeekCommand extends Command {
  constructor() {
    super('seek', 'Skip to a specific time.', [
      { type: 'String', name: 'timestamp', description: 'The time to skip to (HH:MM:SS).' },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const timestamp = options.get('timestamp')
    assert(typeof timestamp === 'string', 'The timestamp should always be a string')
    await serviceProvider.message.defer()

    const result = await serviceProvider.music.seek(timestamp)
    serviceProvider.message.reply(result.value())
  }
}
