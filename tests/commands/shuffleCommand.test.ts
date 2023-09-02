import { mockMessageService, mockMusicService, mockVoiceService } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import ShuffleCommand from '../../src/commands/shuffleCommand'

describe('The shuffle command', () => {
  it('can shuffle a song', async () => {
    // Arrange
    const shuffle = new ShuffleCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    // Act
    await shuffle.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryShuffle).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith('Shuffled Queue')
  })
})
