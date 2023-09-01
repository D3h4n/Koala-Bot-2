import CommandAdapter from '../../src/adapters/commandAdapter'
import SkipCommand from '../../src/commands/skipCommand'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const commandAdapter = new CommandAdapter(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(commandAdapter)

    // Assert
    expect(commandAdapter.music.trySkip).toHaveBeenCalled()
    expect(commandAdapter.message.noReply).toHaveBeenCalled()
  })
})
