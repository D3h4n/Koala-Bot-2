import Command from 'command'
import type IServiceProvider from '@domain/IServiceProvider'

export default class PauseCommand extends Command {
  constructor() {
    super('pause', 'Pause a song that is currently playing')
  }

  async run(serviceProvider: IServiceProvider) {
    if (!(await serviceProvider.music.tryPause())) {
      await serviceProvider.message.reply('Failed to pause the queue')
      return
    }

    await serviceProvider.message.noReply()
  }
}
