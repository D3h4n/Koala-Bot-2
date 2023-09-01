import Command from '../command'
import { IServiceProvider } from '../services/serviceProvider'

export default class ShuffleCommand extends Command {
  constructor() {
    super('shuffle', 'Shuffle the music queue.')
  }

  async run(commandAdapter: IServiceProvider) {
    await commandAdapter.music.tryShuffle()
    await commandAdapter.message.reply('Shuffled Queue')
  }
}
