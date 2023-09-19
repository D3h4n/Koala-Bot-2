import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'

import ServiceProvider from '@services/serviceProvider'
import ShuffleCommand from './shuffle.command'
import { err, ok } from '@domain/monads/Result'

describe('The shuffle command', () => {
  it('can shuffle a song successfully', async () => {
    const successMessage = 'Shuffled queue'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.tryShuffle = jest.fn(async () => ok(successMessage))

    // Arrange
    const shuffle = new ShuffleCommand()

    // Act
    await shuffle.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryShuffle).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
  })

  it('reply with an error response', async () => {
    const errorMessage = 'Shuffled queue'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.tryShuffle = jest.fn(async () => err(errorMessage))

    // Arrange
    const shuffle = new ShuffleCommand()

    // Act
    await shuffle.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryShuffle).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
  })
})
