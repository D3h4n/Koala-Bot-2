import Command from '../commands/command'
import { ICommandAdapter } from '../adapters/commandAdapter'

export interface ICommandHandler {
  handle: (command: ICommandAdapter) => Promise<void>
}

export default class CommandHandler implements ICommandHandler {
  private commands: Map<string, Command>

  constructor(commands: Command[]) {
    this.commands = new Map(
      commands.map((command) => {
        return [command.name, command]
      })
    )
  }

  public handle(commandAdapter: ICommandAdapter) {
    const command = this.commands.get(commandAdapter.name)
    if (!command) {
      throw new Error(`${commandAdapter.name} command is not implemented`)
    }

    return command.run(commandAdapter)
  }
}
