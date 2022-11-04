import commands from '../src/commandHandler'
import { mockCommandInfo } from './mocks'

describe('The command handler after receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('can run the command', (name) => {
      const command = { name, run: jest.fn() }

      // Arrange
      commands.set(name, command)

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
      const command = { name, run: jest.fn() }
      const commandInfo = mockCommandInfo(name, options)

      // Arrange
      commands.set(name, command)

      // Act
      commands.run(commandInfo)

      // Assert
      expect(command.run).toHaveBeenCalledWith(commandInfo)
    })
  })

  describe('that does not exist', () => {
    it('throws an error', () => {
      const test = () => {
        const commandInfo = mockCommandInfo()
        commands.run(commandInfo)
      }

      expect(test).toThrow(Error)
    })
  })
})
