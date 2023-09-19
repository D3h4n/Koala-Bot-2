import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import EmbeddedMessage from 'src/embeds/embeddedMessage'
import ServiceProvider from '@services/serviceProvider'
import NowPlayingCommand from './nowPlaying.command'

describe('The now playing command', () => {
  it('replies with the correct message', async () => {
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    const embed = new EmbeddedMessage({})
    serviceProvider.music.getNowPlaying = jest.fn(() => embed)

    // Arrange
    const nowPlayingCommand = new NowPlayingCommand()

    // Act
    await nowPlayingCommand.run(serviceProvider)

    // Assert
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(embed)
  })
})
