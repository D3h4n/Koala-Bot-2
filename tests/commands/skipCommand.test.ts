import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import SkipCommand from '../../src/commands/skipCommand'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
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
