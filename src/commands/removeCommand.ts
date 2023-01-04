import Command from '../common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class RemoveCommand extends Command {
  constructor() {
    super('remove', 'Remove a song from the queue.', [
      { name: 'position', type: 'INTEGER', description: 'The position of the song to remove.' },
    ])
  }
  async run(commandAdapter: CommandInfo) {
    const position = commandAdapter.options.get('position')
    assert(typeof position === 'number', 'position should always be a number')
    const song = await commandAdapter.music.remove(position)
    await commandAdapter.message.reply(`Removed \`${song}\` at position ${position}`)
  }
}
