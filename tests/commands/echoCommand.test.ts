import EchoCommand from '../../src/commands/echoCommand'
import * as fc from 'fast-check'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'
import CommandAdapter from '../../src/adapters/commandAdapter'

describe('The echo command', () => {
  it('can reply with the correct message', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        const options = new Map([['message', message]])
        const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

        // Arrange
        const echo = new EchoCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        echo.run(commandAdapter, options).then(() => {
          // Assert
          expect(commandAdapter.message.reply).toHaveBeenCalledWith(message)
        })
      })
    )
  })
})
