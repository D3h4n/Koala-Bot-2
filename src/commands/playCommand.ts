import Command from '../command'
import assert from 'assert'
import type { IServiceProvider } from '../services/serviceProvider'
import type { Option } from '../commandHandler'

export default class PlayCommand extends Command {
  constructor() {
    super('play', 'Add a song or playlist to the music queue.', [
      { name: 'song', type: 'String', description: 'URL or Song Name' },
    ])
  }

  async run(commandAdapter: IServiceProvider, options: Map<string, Option>) {
    const song = options.get('song')
    assert(typeof song === 'string', 'song should always be a string')
    await commandAdapter.message.defer()

    const result = await commandAdapter.music.play(song)

    if (result) {
      commandAdapter.message.reply(result)
    } else {
      commandAdapter.message.noReply()
    }
  }
}
