import Command from '../command'
import IServiceProvider from '../domain/services/IServiceProvider'

export default class StopCommand extends Command {
  constructor() {
    super('stop', 'Stop the music queue.')
  }

  async run(serviceProvider: IServiceProvider) {
    await serviceProvider.music.tryStop()
    await serviceProvider.message.noReply()
  }
}
