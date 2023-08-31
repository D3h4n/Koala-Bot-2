import Command from '../command'
import assert from 'assert'
import type { ICommandAdapter, Option } from '../adapters/commandAdapter'

export default class PlayCommand extends Command {
  constructor() {
    super('play', 'Add a song or playlist to the music queue.', [
      { name: 'song', type: 'String', description: 'URL or Song Name' },
    ])
  }

  async run(commandAdapter: ICommandAdapter, options: Map<string, Option>) {
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
