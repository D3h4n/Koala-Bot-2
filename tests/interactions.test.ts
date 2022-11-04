import commands from '../src/commandHandler'
import { mockCommandInfo } from './mocks'

describe('On receiving a command', () => {
  describe('that exists', () => {
    it.each(['play', 'pick-a-game'])('call the action method', (name) => {
      const command = { name, run: jest.fn() }

      // Arrange
      commands.set(name, command)

      // Act
      const commandInfo = mockCommandInfo(name, new Map())
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
    ])('call the action method with options and the adapter', ({ commandName: name, options }) => {
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
    it('throw an error', () => {
      const test = () => {
        const commandInfo = mockCommandInfo()
        commands.run(commandInfo)
      }

      expect(test).toThrow(Error)
    })
  })
})
