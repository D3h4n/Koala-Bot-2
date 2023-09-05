import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'

export default class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip the song that is currently playing.')
  }

  async run(serviceProvider: IServiceProvider) {
    await serviceProvider.music.trySkip()
    await serviceProvider.message.noReply()
  }
}
