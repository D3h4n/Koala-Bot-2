import * as fc from 'fast-check'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import PlayCommand from '../../src/commands/playCommand'

describe('The play command', () => {
  it('can play a song', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (song) => {
        const options = new Map([['song', song]])
        const serviceProvider = new ServiceProvider(
          mockMessageAdapter(),
          mockMusicAdapter(),
          mockVoiceAdapter()
        )

        // Arrange
        const play = new PlayCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        play.run(serviceProvider, options).then(() => {
          // Assert
          expect(serviceProvider.message.defer).toHaveBeenCalled()
          expect(serviceProvider.music.play).toHaveBeenCalledWith(song)
          expect(serviceProvider.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })

  it('replies with an error message', async () => {
    const song = 'A song'
    const errorMsg = 'Some error message'
    const options = new Map([['song', song]])
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )
    serviceProvider.music.play = jest.fn(async () => errorMsg)

    // Arrange
    const play = new PlayCommand()

    // Act
    await play.run(serviceProvider, options)

    // Assert
    expect(serviceProvider.message.defer).toHaveBeenCalled()
    expect(serviceProvider.music.play).toHaveBeenCalledWith(song)
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMsg)
  })
})
