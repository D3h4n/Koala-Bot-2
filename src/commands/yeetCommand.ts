import Command from '../common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'

export default class yeetCommand extends Command {
  constructor() {
    super('yeet', 'Move all connected members between voice channels.')
  }

  async run(commandAdapter: CommandInfo) {
    const channel = commandAdapter.options.get('channel')
    assert(typeof channel === 'string', 'channel should always be of type strings')
    await commandAdapter.voice.moveAll(channel)
    await commandAdapter.message.noReply()
  }
}
