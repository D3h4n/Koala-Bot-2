import Command from '../command'
import assert from 'assert'
import type { ICommandAdapter, Option } from '../adapters/commandAdapter'

export default class RemoveCommand extends Command {
  constructor() {
    super('remove', 'Remove a song from the queue.', [
      { name: 'position', type: 'Integer', description: 'The position of the song to remove.' },
    ])
  }
  async run(options: Map<string, Option>, commandAdapter: ICommandAdapter) {
    const position = options.get('position')
    assert(typeof position === 'number', 'position should always be a number')
    const song = await commandAdapter.music.remove(position)

    if (song) {
      commandAdapter.message.reply(`Removed \`${song}\` at position ${position}`)
    } else {
      commandAdapter.message.reply(`Failed to remove song at position ${position}`)
    }
  }
}
