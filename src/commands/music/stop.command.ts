import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'
import { isErr } from '@domain/monads/Result'

export default class StopCommand extends Command {
  constructor() {
    super('stop', 'Stop the music queue.')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.tryStop()

    if (isErr(result)) {
      return await serviceProvider.message.reply(result.value())
    }

    await serviceProvider.message.noReply()
  }
}
