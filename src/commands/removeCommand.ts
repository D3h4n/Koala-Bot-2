import assert from 'assert'
import Command from 'command'
import type CommandOption from '@domain/CommandOption'
import type IServiceProvider from '@domain/IServiceProvider'

export default class RemoveCommand extends Command {
  constructor() {
    super('remove', 'Remove a song from the queue.', [
      { name: 'position', type: 'Integer', description: 'The position of the song to remove.' },
    ])
  }
  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const position = options.get('position')
    assert(typeof position === 'number', 'position should always be a number')
    const song = await serviceProvider.music.remove(position)

    if (song) {
      serviceProvider.message.reply(`Removed \`${song}\` at position ${position}`)
    } else {
      serviceProvider.message.reply(`Failed to remove song at position ${position}`)
    }
  }
}
