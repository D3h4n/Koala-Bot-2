import Command from 'command'
import type IServiceProvider from '@domain/IServiceProvider'

export default class ShuffleCommand extends Command {
  constructor() {
    super('shuffle', 'Shuffle the music queue.')
  }

  async run(serviceProvider: IServiceProvider) {
    await serviceProvider.music.tryShuffle()
    await serviceProvider.message.reply('Shuffled Queue')
  }
}
