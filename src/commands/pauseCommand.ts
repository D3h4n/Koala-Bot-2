import Command from '../command'
import type { IServiceProvider } from '../services/serviceProvider'

export default class PauseCommand extends Command {
  constructor() {
    super('pause', 'Pause a song that is currently playing')
  }

  async run(commandAdapter: IServiceProvider) {
    if (!(await commandAdapter.music.tryPause())) {
      await commandAdapter.message.reply('Failed to pause the queue')
      return
    }

    await commandAdapter.message.noReply()
  }
}
