import CommandHandler from '../src/handlers/handleCommandEvent'
import { mockCommandAdapter } from './mocks'
import Command from '../src/common'

describe('The command handler after receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('can run the command', (name) => {
      // Arrange
      const command: Command = {
        name,
        description: '',
        options: [],
        permissions: [],
        run: jest.fn(),
        toSlashCommand: jest.fn(),
      }
      const commands = new CommandHandler([command])

      // Act
      const commandInfo = mockCommandAdapter(name)
      commands.handle(commandInfo)

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
        options: [],
        permissions: [],
        run: jest.fn(),
        toSlashCommand: jest.fn(),
      }
      const commands = new CommandHandler([command])

      // Act
      const commandInfo = mockCommandAdapter(name, options)
      commands.handle(commandInfo)

      // Assert
      expect(command.run).toHaveBeenCalledWith(commandInfo)
    })
  })

  describe('that does not exist', () => {
    it('throws an error', () => {
      const commands = new CommandHandler([])

      const test = () => {
        const commandInfo = mockCommandAdapter()
        commands.handle(commandInfo)
      }

      expect(test).toThrow(Error)
    })
  })
})
