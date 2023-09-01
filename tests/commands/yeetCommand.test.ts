import * as fc from 'fast-check'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import YeetCommand from '../../src/commands/yeetCommand'

describe('The yeet command', () => {
  it('can move all users to a voice channel', async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (channel) => {
        const options = new Map([['channel', channel]])
        const serviceProvider = new ServiceProvider(
          mockMessageAdapter(),
          mockMusicAdapter(),
          mockVoiceAdapter()
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
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
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
