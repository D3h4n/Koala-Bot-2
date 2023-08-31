import CommandHandler from '../src/services/commandHandler'
import { messageAdapter, musicAdapter, voiceAdapter } from './mocks'
import Command from '../src/command'
import CommandAdapter from '../src/adapters/commandAdapter'

describe('The command handler after receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('can run the command', (name) => {
      const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())
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
      commands.handle(name, new Map(), commandAdapter)

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
      const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

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
      commands.handle(name, options, commandAdapter)

      // Assert
      expect(command.run).toHaveBeenCalledWith(commandAdapter, options)
    })
  })

  describe('that does not exist', () => {
    it('throws an error', () => {
      const commands = new CommandHandler([])

      const test = () => {
        const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())
        commands.handle('non-existant-command', new Map(), commandAdapter)
      }

      expect(test).toThrow(Error)
    })
  })
})
