import Command from 'command'
import type IServiceProvider from '@domain/IServiceProvider'

export default class ResumeCommand extends Command {
  constructor() {
    super('resume', 'Resume a song that is currently paused')
  }

  async run(serviceProvider: IServiceProvider) {
    if (!(await serviceProvider.music.tryResume())) {
      serviceProvider.message.reply('Failed to resume the queue')
      return
    }

    serviceProvider.message.noReply()
  }
}
