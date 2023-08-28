import { ICommandAdapter } from '../adapters/commandAdapter'
import Command from '../common'

export default class PauseCommand extends Command {
  constructor() {
    super('pause', 'Pause a song that is currently playing')
  }

  async run(commandAdapter: ICommandAdapter) {
    if (!(await commandAdapter.music.tryPause())) {
      await commandAdapter.message.reply('Failed to pause the queue')
      return
    }

    await commandAdapter.message.noReply()
  }
}
