import CommandAdapter from '../../src/adapters/commandAdapter'
import PauseCommand from '../../src/commands/pauseCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'

describe('The pause command', () => {
  it('pauses the currently playing song', async () => {
    const pause = new PauseCommand()
    const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

    commandAdapter.music.tryPause = jest.fn(async () => true)

    await pause.run(commandAdapter)
    expect(commandAdapter.music.tryPause).toHaveBeenCalled()
    expect(commandAdapter.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const pause = new PauseCommand()
    const commandInfo = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

    commandInfo.music.tryPause = jest.fn(async () => false)

    // Act
    await pause.run(commandInfo)

    // Assert
    expect(commandInfo.music.tryPause).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
