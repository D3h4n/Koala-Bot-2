import * as fc from 'fast-check'

import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import RemoveCommand from './remove.command'
import { err, ok } from '@domain/monads/Result'

describe('The remove command', () => {
  it('can remove a song', () => {
    const successMessage = 'Removed song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.remove = jest.fn(async () => ok(successMessage))

    fc.assert(
      fc.property(fc.nat(), (position) => {
        // Arrange
        const remove = new RemoveCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        remove.run(serviceProvider, new Map([['position', position]])).then(() => {
          // Assert
          expect(serviceProvider.music.remove).toHaveBeenCalledWith(position)
          expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
        })
      })
    )
  })

  it('replies with an error message', async () => {
    const errorMessage = 'Failed to remove song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.remove = jest.fn(async () => err(errorMessage))

    // Arrange
    const remove = new RemoveCommand()

    // Act
    await remove.run(serviceProvider, new Map([['position', 2]]))

    // Assert
    expect(serviceProvider.music.remove).toHaveBeenCalledWith(2)
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
  })
})
