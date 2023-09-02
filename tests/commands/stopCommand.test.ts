import { mockMessageService, mockMusicService, mockVoiceService } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import StopCommand from '../../src/commands/stopCommand'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    // Arrange
    const stop = new StopCommand()

    // Act
    await stop.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryStop).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })
})
