import * as fc from 'fast-check'

import {
  mockMessageService,
  mockMusicService,
  mockVoiceService,
} from '../../testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import RemoveCommand from './removeCommand'

describe('The remove command', () => {
  it('can remove a song', () => {
    fc.assert(
      fc.property(fc.nat(), fc.string({ minLength: 1 }), (position, song) => {
        const options = new Map([['position', position]])
        const serviceProvider = new ServiceProvider(
          mockMessageService(),
          mockMusicService(),
          mockVoiceService()
        )
        serviceProvider.music.remove = jest.fn(async () => song)

        // Arrange
        const remove = new RemoveCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        remove.run(serviceProvider, options).then(() => {
          // Assert
          expect(serviceProvider.music.remove).toHaveBeenCalledWith(position)
          expect(serviceProvider.message.reply).toHaveBeenCalled()
          expect((<jest.Mock>serviceProvider.message.reply).mock.lastCall?.[0]).toContain(song)
        })
      })
    )
  })

  it('replies with an error message', async () => {
    const position = 2
    const options = new Map([['position', position]])
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.remove = jest.fn(async () => null)

    // Arrange
    const remove = new RemoveCommand()

    // Act
    // Note: for consistency, need to wait on async command to run completely before
    // assertions but can't use async await with fast-check
    await remove.run(serviceProvider, options)

    // Assert
    expect(serviceProvider.music.remove).toHaveBeenCalledWith(position)
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(
      `Failed to remove song at position ${position}`
    )
  })
})
