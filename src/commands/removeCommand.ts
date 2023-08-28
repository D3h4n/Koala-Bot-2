import Command from './command'
import { ICommandAdapter } from '../adapters/commandAdapter'
import assert from 'assert'

export default class RemoveCommand extends Command {
  constructor() {
    super('remove', 'Remove a song from the queue.', [
      { name: 'position', type: 'Integer', description: 'The position of the song to remove.' },
    ])
  }
  async run(commandAdapter: ICommandAdapter) {
    const position = commandAdapter.options.get('position')
    assert(typeof position === 'number', 'position should always be a number')
    const song = await commandAdapter.music.remove(position)

    if (song) {
      commandAdapter.message.reply(`Removed \`${song}\` at position ${position}`)
    } else {
      commandAdapter.message.reply(`Failed to remove song at position ${position}`)
    }
  }
}
