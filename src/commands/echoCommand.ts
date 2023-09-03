import assert from 'assert'
import Command from 'command'
import type CommandOption from '@domain/CommandOption'
import type IServiceProvider from '@domain/IServiceProvider'

export default class EchoCommand extends Command {
  constructor() {
    super('echo', 'I repeat whatever you want.', [
      { name: 'message', type: 'String', description: 'The message to repeat.' },
    ])
  }

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const message = options.get('message')
    assert(typeof message === 'string', 'message should be a string')
    await serviceProvider.message.reply(message)
  }
}
