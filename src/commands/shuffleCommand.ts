import Command from '../command'
import { ICommandAdapter } from '../adapters/commandAdapter'

export default class ShuffleCommand extends Command {
  constructor() {
    super('shuffle', 'Shuffle the music queue.')
  }

  async run(commandAdapter: ICommandAdapter) {
    await commandAdapter.music.tryShuffle()
    await commandAdapter.message.reply('Shuffled Queue')
  }
}
