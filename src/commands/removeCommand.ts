import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class RemoveCommand extends Command {
  constructor() {
    super('remove')
  }
  async run(commandAdapter: CommandInfo) {
    const position = commandAdapter.options.get('position')
    assert(typeof position === 'number', 'position should always be a number')
    await commandAdapter.music.remove(position)
  }
}
