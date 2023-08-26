import { CommandInfo } from '../adapters/commandAdapter'
import Command from '../common'

export default class ResumeCommand extends Command {
  constructor() {
    super('resume', 'Resume a song that is currently paused')
  }

  async run(commandAdapter: CommandInfo) {
    if (!(await commandAdapter.music.tryResume())) {
      commandAdapter.message.reply('Failed to resume the queue')
      return
    }

    commandAdapter.message.noReply()
  }
}
