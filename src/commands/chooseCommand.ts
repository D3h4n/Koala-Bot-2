import Command from '../command'
import type { IServiceProvider } from '../services/serviceProvider'
import type { Option } from '../commandHandler'

export default class ChooseCommand extends Command {
  constructor() {
    super(
      'choose',
      'Let the bot decide your fate.',
      Array.from({ length: 9 }, (_, idx) => ({
        name: `choice${idx + 1}`,
        type: 'String',
        description: `Choice ${idx + 1}.`,
        required: idx <= 1,
      }))
    )
  }

  async run(commandAdapter: IServiceProvider, options: Map<string, Option>) {
    const choices = this.getValidChoices(options)
    await commandAdapter.message.reply(this.getRandomChoice(choices))
  }

  private getValidChoices(options: Map<string, Option>) {
    return (
      Array.from(options.entries())
        .filter(([name, value]) => name.match(/choice[1-9]/) && typeof value === 'string')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, value]) => value as string)
    )
  }

  private getRandomChoice(choices: string[]): string {
    return `\`${choices[Math.floor(Math.random() * choices.length)]}\``
  }
}
