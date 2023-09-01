import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import PauseCommand from '../../src/commands/pauseCommand'

describe('The pause command', () => {
  it('pauses the currently playing song', async () => {
    const pause = new PauseCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    serviceProvider.music.tryPause = jest.fn(async () => true)

    await pause.run(serviceProvider)
    expect(serviceProvider.music.tryPause).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const pause = new PauseCommand()
    const commandInfo = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    commandInfo.music.tryPause = jest.fn(async () => false)

    // Act
    await pause.run(commandInfo)

    // Assert
    expect(commandInfo.music.tryPause).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
