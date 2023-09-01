import * as fc from 'fast-check'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import EchoCommand from '../../src/commands/echoCommand'

describe('The echo command', () => {
  it('can reply with the correct message', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        const options = new Map([['message', message]])
        const serviceProvider = new ServiceProvider(
          mockMessageAdapter(),
          mockMusicAdapter(),
          mockVoiceAdapter()
        )

        // Arrange
        const echo = new EchoCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        echo.run(serviceProvider, options).then(() => {
          // Assert
          expect(serviceProvider.message.reply).toHaveBeenCalledWith(message)
        })
      })
    )
  })
})
