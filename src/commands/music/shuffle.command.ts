import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'
import { isErr } from '@domain/monads/Result'

export default class ShuffleCommand extends Command {
  constructor() {
    super('shuffle', 'Shuffle the music queue.')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.tryShuffle()

    if (isErr(result)) {
      return await serviceProvider.message.reply(result.err)
    }

    await serviceProvider.message.reply(result.data)
  }
}
