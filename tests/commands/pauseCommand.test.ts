import PauseCommand from '../../src/commands/pauseCommand'
import { mockCommandAdapter } from '../mocks'

describe('The pause command', () => {
  it('pauses the currently playing song', async () => {
    const pause = new PauseCommand()
    const commandInfo = mockCommandAdapter()

    commandInfo.music.tryPause = jest.fn(async () => true)

    await pause.run(commandInfo)
    expect(commandInfo.music.tryPause).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const pause = new PauseCommand()
    const commandInfo = mockCommandAdapter()

    commandInfo.music.tryPause = jest.fn(async () => false)

    // Act
    await pause.run(commandInfo)

    // Assert
    expect(commandInfo.music.tryPause).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
