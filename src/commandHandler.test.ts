import { mockMessageService, mockMusicService, mockVoiceService } from './testFixtures/mocks.test'

import Command from './command'
import CommandHandler from './commandHandler'
import ServiceProvider from './services/serviceProvider'

describe('The command handler after receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('can run the command', async (name) => {
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
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
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
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
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
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
