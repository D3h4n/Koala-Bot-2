import EchoCommand from '../../src/commands/echoCommand'
import * as fc from 'fast-check'
import { mockCommandInfo } from '../mocks'

describe('The echo command', () => {
  it('can reply with the correct message', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        // Arrange
        const echo = new EchoCommand()
        const commandInfo = mockCommandInfo('', new Map([['message', message]]))

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        echo.run(commandInfo).then(() => {
          // Assert
          expect(commandInfo.message.reply).toHaveBeenCalledWith(message)
        })
      })
    )
  })
})
