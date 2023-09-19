import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'
import { isErr } from '@domain/monads/Result'

export default class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip the song that is currently playing.')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.trySkip()

    if (isErr(result)) {
      return await serviceProvider.message.reply(result.err)
    }

    await serviceProvider.message.noReply()
  }
}
