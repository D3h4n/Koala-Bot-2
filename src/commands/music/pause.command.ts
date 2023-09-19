import Command from 'src/command'
import { isErr } from '@domain/monads/Result'
import IServiceProvider from '@domain/IServiceProvider'

export default class PauseCommand extends Command {
  constructor() {
    super('pause', 'Pause a song that is currently playing')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.tryPause()

    if (isErr(result)) {
      return await serviceProvider.message.reply(result.err)
    }

    await serviceProvider.message.reply(result.data)
  }
}
