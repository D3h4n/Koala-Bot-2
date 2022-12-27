import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'

export default class ShuffleCommand extends Command {
  constructor() {
    super('shuffle')
  }

  async run(commandAdapter: CommandInfo) {
    await commandAdapter.music.shuffle()
    await commandAdapter.message.reply('Shuffled Queue')
  }
}
