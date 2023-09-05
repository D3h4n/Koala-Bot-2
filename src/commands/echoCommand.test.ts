import * as fc from 'fast-check'

import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import EchoCommand from './echoCommand'

describe('The echo command', () => {
  it('can reply with the correct message', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        const options = new Map([['message', message]])
        const serviceProvider = new ServiceProvider(
          mockMessageService(),
          mockMusicService(),
          mockVoiceService()
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
