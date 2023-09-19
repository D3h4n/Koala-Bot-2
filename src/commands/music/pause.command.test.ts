import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'

import ServiceProvider from '@services/serviceProvider'
import PauseCommand from './pause.command'
import { err, ok } from '@domain/monads/Result'

describe('The pause command', () => {
  it('pauses the currently playing song', async () => {
    const successMessage = 'Paused song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.tryPause = jest.fn(async () => ok(successMessage))

    // Arrange
    const pause = new PauseCommand()

    // Act
    await pause.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryPause).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
  })

  it('replies with a message if pausing fails', async () => {
    const errorMessage = 'Failed to pause song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.tryPause = jest.fn(async () => err(errorMessage))

    // Arrange
    const pause = new PauseCommand()

    // Act
    await pause.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryPause).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
  })
})
