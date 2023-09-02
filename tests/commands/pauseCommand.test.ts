import { mockMessageService, mockMusicService, mockVoiceService } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import PauseCommand from '../../src/commands/pauseCommand'

describe('The pause command', () => {
  it('pauses the currently playing song', async () => {
    const pause = new PauseCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.tryPause = jest.fn(async () => true)

    await pause.run(serviceProvider)
    expect(serviceProvider.music.tryPause).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const pause = new PauseCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.tryPause = jest.fn(async () => false)

    // Act
    await pause.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryPause).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>serviceProvider.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
