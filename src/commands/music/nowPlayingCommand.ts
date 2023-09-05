import IServiceProvider from '@domain/IServiceProvider'
import Command from 'src/command'

export default class nowPlayingCommand extends Command {
  constructor() {
    super('nowplaying', 'display the song that is currently playing')
  }

  async run(serviceProvider: IServiceProvider): Promise<void> {
    const message = serviceProvider.music.getNowPlaying()
    await serviceProvider.message.reply(message)
  }
}
