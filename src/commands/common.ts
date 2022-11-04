import { CommandInfo } from '../adapters/commandAdapter'

export type Option = string | number | boolean | undefined

export abstract class Command {
  readonly name: string

  protected constructor(name: string) {
    this.name = name
  }

  abstract run(commandAdapter: CommandInfo): Promise<void>
}
