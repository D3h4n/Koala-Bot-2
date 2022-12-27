import ChooseCommand from './commands/chooseCommand'
import EchoCommand from './commands/echoCommand'
import PlayCommand from './commands/playCommand'
import QueueCommand from './commands/queueCommand'
import ShuffleCommand from './commands/shuffleCommand'
import SkipCommand from './commands/skipCommand'
import StopCommand from './commands/stopCommand'
import { Command } from './commands/common'
import { CommandInfo } from './adapters/commandAdapter'
import RemoveCommand from './commands/removeCommand'

class CommandHandler {
  private commands: Map<string, Command>

  constructor() {
    this.commands = new Map()
  }

  public add(command: Command) {
    this.commands.set(command.name, command)
  }

  public run(commandAdapter: CommandInfo) {
    const command = this.commands.get(commandAdapter.name)
    if (!command) throw new Error(`ERROR: Command ${commandAdapter.name} was not found`)
    return command.run(commandAdapter)
  }
}

export default (() => {
  const handler = new CommandHandler()
  const commands = [
    ChooseCommand,
    EchoCommand,
    PlayCommand,
    QueueCommand,
    RemoveCommand,
    ShuffleCommand,
    SkipCommand,
    StopCommand,
  ]

  commands.forEach((command) => {
    handler.add(new command())
  })

  return handler
})()
