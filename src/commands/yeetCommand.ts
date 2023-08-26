import Command from '../common'
import { CommandInfo } from '../adapters/commandAdapter'
import assert from 'assert'
import { ChannelType } from 'discord.js'

export default class yeetCommand extends Command {
  constructor() {
    super(
      'yeet',
      'Move all connected members between voice channels.',
      [
        {
          name: 'channel',
          type: 'CHANNEL',
          description: 'Target channel.',
          channelTypes: [ChannelType.GuildVoice],
        },
      ],
      ['MoveMembers']
    )
  }

  async run(commandAdapter: CommandInfo) {
    const channel = commandAdapter.options.get('channel')
    assert(typeof channel === 'string', 'channel should always be of type string')
    await commandAdapter.voice.moveAll(channel)
    await commandAdapter.message.noReply()
  }
}
