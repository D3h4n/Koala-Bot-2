import CommandHandler from '../src/commandHandler'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from './mocks'
import Command from '../src/command'
import ServiceProvider from '../src/services/serviceProvider'

describe('The command handler after receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('can run the command', async (name) => {
      const serviceProvider = new ServiceProvider(
        mockMessageAdapter(),
        mockMusicAdapter(),
        mockVoiceAdapter()
      )
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
      await commands.handle(name, new Map(), serviceProvider)

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
    ])('can run the command with options', async ({ commandName: name, options }) => {
      const serviceProvider = new ServiceProvider(
        mockMessageAdapter(),
        mockMusicAdapter(),
        mockVoiceAdapter()
      )

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
      await commands.handle(name, options, serviceProvider)

      // Assert
      expect(command.run).toHaveBeenCalledWith(serviceProvider, options)
    })
  })

  describe('that does not exist', () => {
    it('throws an error', async () => {
      const serviceProvider = new ServiceProvider(
        mockMessageAdapter(),
        mockMusicAdapter(),
        mockVoiceAdapter()
      )

      // Arrange
      const commands = new CommandHandler([])

      // Act/Assert
      await expect(
        async () => await commands.handle('non-existant-command', new Map(), serviceProvider)
      ).rejects.toThrow()
    })
  })
})
