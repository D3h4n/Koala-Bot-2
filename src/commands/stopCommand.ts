import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'

export default class StopCommand extends Command {
  constructor() {
    super('stop')
  }

  async run(commandAdapter: CommandInfo) {
    await commandAdapter.music.stop()
    await commandAdapter.message.noReply()
  }
}
