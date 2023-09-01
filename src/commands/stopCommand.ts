import Command from '../command'
import { IServiceProvider } from '../services/serviceProvider'

export default class StopCommand extends Command {
  constructor() {
    super('stop', 'Stop the music queue.')
  }

  async run(commandAdapter: IServiceProvider) {
    await commandAdapter.music.tryStop()
    await commandAdapter.message.noReply()
  }
}
