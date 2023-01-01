import { Command } from './common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class QueueCommand extends Command {
  constructor() {
    super('queue')
  }

  async run(commandAdapter: CommandInfo) {
    const page = commandAdapter.options.get('page')
    assert(
      page === undefined || typeof page === 'number',
      'if page is defined it should be a number'
    )
    const embed = await commandAdapter.music.queue(page)
    await commandAdapter.message.replyWithEmbeddedMessage(embed)
  }
}
