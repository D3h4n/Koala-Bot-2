import EchoCommand from '../../src/commands/echoCommand'
import * as fc from 'fast-check'
import { mockCommandInfo } from '../mocks'

describe('The echo command', () => {
  it('can reply with the correct message', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        // Act
        const echo = new EchoCommand()
        const commandInfo = mockCommandInfo('', new Map([['message', message]]))
        echo.run(commandInfo)

        // Assert
        expect(commandInfo.message.reply).toHaveBeenCalledWith(message)
      })
    )
  })
})
