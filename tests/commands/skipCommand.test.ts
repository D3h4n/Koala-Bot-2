import CommandAdapter from '../../src/adapters/commandAdapter'
import SkipCommand from '../../src/commands/skipCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(new Map(), commandAdapter)

    // Assert
    expect(commandAdapter.music.skip).toHaveBeenCalled()
    expect(commandAdapter.message.noReply).toHaveBeenCalled()
  })
})
