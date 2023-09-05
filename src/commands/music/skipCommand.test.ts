import {
  mockMessageService,
  mockMusicService,
  mockVoiceService,
} from '../../testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import SkipCommand from './skipCommand'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.trySkip).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })
})
