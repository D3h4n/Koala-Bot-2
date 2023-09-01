import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import StopCommand from '../../src/commands/stopCommand'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
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
