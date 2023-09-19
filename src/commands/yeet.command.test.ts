import * as fc from 'fast-check'

import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import YeetCommand from './yeet.command'

describe('The yeet command', () => {
  it('can move all users to a voice channel', async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (channel) => {
        const options = new Map([['channel', channel]])
        const serviceProvider = new ServiceProvider(
          mockMessageService(),
          mockMusicService(),
          mockVoiceService()
        )

        // Arrange
        const yeet = new YeetCommand()

        // Act
        yeet.run(serviceProvider, options).then(() => {
          // Assert
          expect(serviceProvider.voice.moveAll).toHaveBeenCalledWith(channel)
          expect(serviceProvider.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })

  it('can reply with an error message', async () => {
    const channel = 'A Music Channel'
    const errorMsg = 'Some error message'

    const options = new Map([['channel', channel]])
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.voice.moveAll = jest.fn(async () => errorMsg)

    // Arrange
    const yeet = new YeetCommand()

    // Act
    await yeet.run(serviceProvider, options)

    // Assert
    expect(serviceProvider.voice.moveAll).toHaveBeenCalledWith(channel)
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMsg)
  })
})
