import CommandHandler from '../src/commandHandler'
import { mockCommandInfo } from './mocks'
import Command from '../src/common'

describe('The command handler after receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('can run the command', (name) => {
      // Arrange
      const command: Command = {
        name,
        description: '',
        permissions: ['Administrator'],
        run: jest.fn(),
      }
      const commands = new CommandHandler([command])

      // Act
      const commandInfo = mockCommandInfo(name)
      commands.run(commandInfo)

      // Assert
      expect(command.run).toHaveBeenCalled()
    })

    it.each([
      { commandName: 'play', options: new Map([['test', true]]) },
      {
        commandName: 'dance',
        options: new Map<string, string | number>([
          ['key', 'value'],
          ['num', 123],
        ]),
      },
    ])('can run the command with options', ({ commandName: name, options }) => {
      // Arrange
      const command: Command = {
        name,
        description: '',
        permissions: ['Administrator'],
        run: jest.fn(),
      }
      const commands = new CommandHandler([command])

      // Act
      const commandInfo = mockCommandInfo(name, options)
      commands.run(commandInfo)

      // Assert
      expect(command.run).toHaveBeenCalledWith(commandInfo)
    })
  })

  describe('that does not exist', () => {
    it('throws an error', () => {
      const commands = new CommandHandler([])

      const test = () => {
        const commandInfo = mockCommandInfo()
        commands.run(commandInfo)
      }

      expect(test).toThrow(Error)
    })
  })
})
