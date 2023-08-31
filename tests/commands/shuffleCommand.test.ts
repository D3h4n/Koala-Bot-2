import CommandAdapter from '../../src/adapters/commandAdapter'
import ShuffleCommand from '../../src/commands/shuffleCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'

describe('The shuffle command', () => {
  it('can shuffle a song', async () => {
    // Arrange
    const shuffle = new ShuffleCommand()
    const commandAdapter = new CommandAdapter(
      new Map(),
      messageAdapter(),
      musicAdapter(),
      voiceAdapter()
    )

    // Act
    await shuffle.run(commandAdapter)

    // Assert
    expect(commandAdapter.music.shuffle).toHaveBeenCalled()
    expect(commandAdapter.message.reply).toHaveBeenCalledWith('Shuffled Queue')
  })
})
