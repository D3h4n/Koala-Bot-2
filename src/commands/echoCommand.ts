import Command from '../command'
import assert from 'assert'
import IServiceProvider from '../domain/services/IServiceProvider'
import type { CommandOption } from 'src/domain/CommandOption'

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
