import Command from 'src/command'
import type IServiceProvider from '@domain/IServiceProvider'
import type CommandOption from '@domain/CommandOption'

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

  async run(serviceProvider: IServiceProvider, options: Map<string, CommandOption>) {
    const choices = this.getValidChoices(options)
    await serviceProvider.message.reply(this.getRandomChoice(choices))
  }

  private getValidChoices(options: Map<string, CommandOption>) {
    return (
      Array.from(options.entries())
        .filter(([name, value]) => name.match(/choice[1-9]/) && typeof value === 'string')
        .map(([_, value]) => value as string)
    )
  }

  private getRandomChoice(choices: string[]): string {
    return `\`${choices[Math.floor(Math.random() * choices.length)]}\``
  }
}
