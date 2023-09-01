import CommandAdapter from '../../src/adapters/commandAdapter'
import ShuffleCommand from '../../src/commands/shuffleCommand'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

describe('The shuffle command', () => {
  it('can shuffle a song', async () => {
    // Arrange
    const shuffle = new ShuffleCommand()
    const commandAdapter = new CommandAdapter(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    // Act
    await shuffle.run(commandAdapter)

    // Assert
    expect(commandAdapter.music.tryShuffle).toHaveBeenCalled()
    expect(commandAdapter.message.reply).toHaveBeenCalledWith('Shuffled Queue')
  })
})
