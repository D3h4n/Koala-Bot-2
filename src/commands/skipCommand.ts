import Command from '../command'
import { IServiceProvider } from '../services/serviceProvider'

export default class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip the song that is currently playing.')
  }

  async run(commandAdapter: IServiceProvider) {
    await commandAdapter.music.trySkip()
    await commandAdapter.message.noReply()
  }
}
