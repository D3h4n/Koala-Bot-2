import assert from 'assert'
import Command from 'src/command'
import type CommandOption from '@domain/CommandOption'
import type IServiceProvider from '@domain/IServiceProvider'

export default class LoopCommand extends Command {
  constructor() {
    super('loop', 'control looping a song or the queue', [
      { type: 'Subcommand', name: 'queue', description: 'loop the entire queue' },
      { type: 'Subcommand', name: 'song', description: 'loop a single song' },
      { type: 'Subcommand', name: 'off', description: 'stop looping' },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>): Promise<void> {
    assert(options.size === 1, 'Only a single subcommand should be provided')
    const subcommand = Array.from(options.keys())[0]
    assert(
      subcommand === 'queue' || subcommand === 'song' || subcommand === 'off',
      'The subcommand should always be one of these options'
    )

    const result = await serviceProvider.music.loop(subcommand)

    if (result === null) {
      await serviceProvider.message.reply(
        'Failed to ' + (subcommand === 'off' ? 'stop looping' : `loop ${subcommand}`)
      )
      return
    }

    await serviceProvider.message.reply(result)
  }
}
