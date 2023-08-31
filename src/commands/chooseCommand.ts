import Command from '../command'
import type { ICommandAdapter, Option } from '../adapters/commandAdapter'

export default class ChooseCommand extends Command {
  constructor() {
    super(
      'choose',
      'Let the bot decide your fate.',
      [...new Array(9)].map((_, idx) => ({
        name: `choice${idx + 1}`,
        type: 'String',
        description: `Choice ${idx + 1}.`,
        required: idx <= 1,
      }))
    )
  }

  async run(commandAdapter: ICommandAdapter, options: Map<string, Option>) {
    const choices = this.getValidChoices(options)
    await commandAdapter.message.reply(this.getRandomChoice(choices))
  }

  private getValidChoices(options: Map<string, Option>) {
    return (
      [...options.entries()]
        .filter(([name, value]) => name.match(/choice[1-9]/) && typeof value === 'string')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, value]) => value as string)
    )
  }

  private getRandomChoice(choices: string[]): string {
    return `\`${choices[Math.floor(Math.random() * choices.length)]}\``
  }
}
