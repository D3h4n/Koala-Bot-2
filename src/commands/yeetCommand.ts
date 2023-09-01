import Command from '../command'
import assert from 'assert'
import { ChannelType } from 'discord.js'
import type { IServiceProvider } from '../services/serviceProvider'
import type { Option } from '../commandHandler'

export default class yeetCommand extends Command {
  constructor() {
    super(
      'yeet',
      'Move all connected members between voice channels.',
      [
        {
          name: 'channel',
          type: 'Channel',
          description: 'Target channel.',
          channelTypes: [ChannelType.GuildVoice],
        },
      ],
      ['MoveMembers']
    )
  }

  async run(commandAdapter: IServiceProvider, options: Map<string, Option>) {
    const channel = options.get('channel')
    assert(typeof channel === 'string', 'channel should always be of type string')
    const result = await commandAdapter.voice.moveAll(channel)

    if (result) {
      commandAdapter.message.reply(result)
    } else {
      commandAdapter.message.noReply()
    }
  }
}
