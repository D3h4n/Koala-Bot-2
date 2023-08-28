import Command from './command'
import { ICommandAdapter } from '../adapters/commandAdapter'

export default class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip the song that is currently playing.')
  }

  async run(commandAdapter: ICommandAdapter) {
    await commandAdapter.music.skip()
    await commandAdapter.message.noReply()
  }
}
