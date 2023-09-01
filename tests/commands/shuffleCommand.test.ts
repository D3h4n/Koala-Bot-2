import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import ShuffleCommand from '../../src/commands/shuffleCommand'

describe('The shuffle command', () => {
  it('can shuffle a song', async () => {
    // Arrange
    const shuffle = new ShuffleCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    // Act
    await shuffle.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryShuffle).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith('Shuffled Queue')
  })
})
