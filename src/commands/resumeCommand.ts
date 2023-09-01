import { IServiceProvider } from '../services/serviceProvider'
import Command from '../command'

export default class ResumeCommand extends Command {
  constructor() {
    super('resume', 'Resume a song that is currently paused')
  }

  async run(commandAdapter: IServiceProvider) {
    if (!(await commandAdapter.music.tryResume())) {
      commandAdapter.message.reply('Failed to resume the queue')
      return
    }

    commandAdapter.message.noReply()
  }
}
