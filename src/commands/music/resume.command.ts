import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'

export default class ResumeCommand extends Command {
  constructor() {
    super('resume', 'Resume a song that is currently paused')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.tryResume()
    await serviceProvider.message.reply(result.value())
  }
}
