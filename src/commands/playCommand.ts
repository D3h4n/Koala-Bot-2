import Command from '../command'
import assert from 'assert'
import { IServiceProvider } from '../domain/services/IServiceProvider'
import type { Option } from '../commandHandler'

export default class PlayCommand extends Command {
  constructor() {
    super('play', 'Add a song or playlist to the music queue.', [
      { name: 'song', type: 'String', description: 'URL or Song Name' },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, Option>) {
    const song = options.get('song')
    assert(typeof song === 'string', 'song should always be a string')
    await serviceProvider.message.defer()

    const result = await serviceProvider.music.play(song)

    if (result) {
      serviceProvider.message.reply(result)
    } else {
      serviceProvider.message.noReply()
    }
  }
}
