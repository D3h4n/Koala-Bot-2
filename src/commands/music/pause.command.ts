import Command from 'src/command'
import IServiceProvider from '@domain/IServiceProvider'

export default class PauseCommand extends Command {
  constructor() {
    super('pause', 'Pause a song that is currently playing')
  }

  async run(serviceProvider: IServiceProvider) {
    const result = await serviceProvider.music.tryPause()
    await serviceProvider.message.reply(result.value())
  }
}
