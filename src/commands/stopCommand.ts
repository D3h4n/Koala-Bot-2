import Command from '../command'
import { ICommandAdapter } from '../adapters/commandAdapter'

export default class StopCommand extends Command {
  constructor() {
    super('stop', 'Stop the music queue.')
  }

  async run(commandAdapter: ICommandAdapter) {
    await commandAdapter.music.stop()
    await commandAdapter.message.noReply()
  }
}
