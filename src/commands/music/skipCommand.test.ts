import {
  mockMessageService,
  mockMusicService,
  mockVoiceService,
} from '../../testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import SkipCommand from './skipCommand'
import { err, ok } from '@domain/monads/Result'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.trySkip = jest.fn(async () => ok())

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.trySkip).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })

  it('reply with an error message', async () => {
    const errorMessage = 'Failed to skip song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.trySkip = jest.fn(async () => err(errorMessage))

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.trySkip).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
  })
})
