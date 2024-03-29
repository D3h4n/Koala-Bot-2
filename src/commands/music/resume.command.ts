import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'
import { isOk } from '@domain/monads/Result'

export default class ResumeCommand extends Command {
  constructor() {
    super('resume', 'Resume a song that is currently paused')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.tryResume()

    if (isOk(result)) {
      return await serviceProvider.message.reply(result.data)
    }

    await serviceProvider.message.reply(result.err)
  }
}
