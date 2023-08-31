import Command from '../command'
import { ICommandAdapter } from '../adapters/commandAdapter'

export default class ShuffleCommand extends Command {
  constructor() {
    super('shuffle', 'Shuffle the music queue.')
  }

  async run(_, commandAdapter: ICommandAdapter) {
    await commandAdapter.music.shuffle()
    await commandAdapter.message.reply('Shuffled Queue')
  }
}
