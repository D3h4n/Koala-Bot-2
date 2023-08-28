import Command from './common'
import { ICommandAdapter } from './adapters/commandAdapter'

export default class CommandHandler {
  private commands: Map<string, Command>

  constructor(commands: Command[]) {
    this.commands = new Map(
      commands.map((command) => {
        return [command.name, command]
      })
    )
  }

  public run(commandAdapter: ICommandAdapter) {
    const command = this.commands.get(commandAdapter.name)
    if (!command) throw new Error(`${commandAdapter.name} command is not implemented`)
    return command.run(commandAdapter)
  }
}
