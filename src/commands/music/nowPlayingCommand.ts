import IServiceProvider from '@domain/IServiceProvider'
import Command from 'src/command'

export default class nowPlayingCommand extends Command {
  constructor() {
    super('nowplaying', 'display the song that is currently playing')
  }

  async run(serviceProvider: IServiceProvider): Promise<void> {
    await serviceProvider.message.reply(serviceProvider.music.getNowPlaying())
  }
}
