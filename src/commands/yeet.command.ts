import assert from 'assert'
import Command from 'src/command'
import { ChannelType } from 'discord.js'
import type CommandOption from '@domain/CommandOption'
import type IServiceProvider from '@domain/IServiceProvider'

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

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const channel = options.get('channel')
    assert(typeof channel === 'string', 'channel should always be of type string')
    const result = await serviceProvider.voice.moveAll(channel)

    if (result) {
      serviceProvider.message.reply(result)
    } else {
      serviceProvider.message.noReply()
    }
  }
}
