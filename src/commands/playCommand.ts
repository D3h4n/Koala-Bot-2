import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'

export default class PlayCommand extends Command {
  constructor() {
    super('play')
  }

  async run(commandAdapter: CommandInfo) {
    const song = commandAdapter.options.get('song')
    if (typeof song !== 'string') throw new Error('ERROR: song should always be a string')
    await commandAdapter.music.play(song)
  }
}
