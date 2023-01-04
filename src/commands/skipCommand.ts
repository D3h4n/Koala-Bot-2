import Command from '../common'
import { CommandInfo } from '../adapters/commandAdapter'

export default class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip the song that is currently playing.')
  }

  async run(commandAdapter: CommandInfo) {
    await commandAdapter.music.skip()
    await commandAdapter.message.noReply()
  }
}
