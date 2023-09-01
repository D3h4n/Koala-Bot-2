import CommandAdapter from '../../src/adapters/commandAdapter'
import StopCommand from '../../src/commands/stopCommand'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    const commandAdapter = new CommandAdapter(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    // Arrange
    const stop = new StopCommand()

    // Act
    await stop.run(commandAdapter)

    // Assert
    expect(commandAdapter.music.tryStop).toHaveBeenCalled()
    expect(commandAdapter.message.noReply).toHaveBeenCalled()
  })
})
