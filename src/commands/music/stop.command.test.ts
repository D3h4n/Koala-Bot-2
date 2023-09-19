import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import StopCommand from './stop.command'
import { err, ok } from '@domain/monads/Result'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.tryStop = jest.fn(async () => ok())

    // Arrange
    const stop = new StopCommand()

    // Act
    await stop.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryStop).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })

  it('can reply with an error message', async () => {
    const errorMessage = 'Failed to stop queue'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.tryStop = jest.fn(async () => err(errorMessage))

    // Arrange
    const stop = new StopCommand()

    // Act
    await stop.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryStop).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
  })
})
