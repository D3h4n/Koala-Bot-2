import Command from '../common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class PlayCommand extends Command {
  constructor() {
    super('play', 'Add a song or playlist to the music queue.', [
      { name: 'song', type: 'STRING', description: 'URL or Song Name' },
    ])
  }

  async run(commandAdapter: CommandInfo) {
    const song = commandAdapter.options.get('song')
    assert(typeof song === 'string', 'song should always be a string')
    await commandAdapter.message.defer()
    await commandAdapter.music.play(song)
    await commandAdapter.message.noReply()
  }
}
