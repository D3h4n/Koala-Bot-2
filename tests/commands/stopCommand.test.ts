import CommandAdapter from '../../src/adapters/commandAdapter'
import StopCommand from '../../src/commands/stopCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

    // Arrange
    const stop = new StopCommand()

    // Act
    await stop.run(commandAdapter)

    // Assert
    expect(commandAdapter.music.stop).toHaveBeenCalled()
    expect(commandAdapter.message.noReply).toHaveBeenCalled()
  })
})
