import assert from 'assert'
import Command from 'src/command'
import type CommandOption from '@domain/CommandOption'
import type IServiceProvider from '@domain/IServiceProvider'
import { isErr } from '@domain/monads/Result'

export default class PlayCommand extends Command {
  constructor() {
    super('play', 'Add a song or playlist to the music queue.', [
      { name: 'song', type: 'String', description: 'URL or Song Name' },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const song = options.get('song')
    assert(typeof song === 'string', 'song should always be a string')
    await serviceProvider.message.defer()

    const result = await serviceProvider.music.play(song)

    if (isErr(result)) {
      return await serviceProvider.message.reply(result.value())
    }

    await serviceProvider.message.noReply()
  }
}
