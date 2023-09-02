import Command from '../command'
import { IServiceProvider } from '../domain/services/IServiceProvider'

export default class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip the song that is currently playing.')
  }

  async run(serviceProvider: IServiceProvider) {
    await serviceProvider.music.trySkip()
    await serviceProvider.message.noReply()
  }
}
