import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'

export default class StopCommand extends Command {
  constructor() {
    super('stop', 'Stop the music queue.')
  }

  async run(serviceProvider: IServiceProvider) {
    await serviceProvider.music.tryStop()
    await serviceProvider.message.noReply()
  }
}
