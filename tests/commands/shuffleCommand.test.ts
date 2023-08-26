import ShuffleCommand from '../../src/commands/shuffleCommand'
import { mockCommandInfo } from '../mocks'

describe('The shuffle command', () => {
  it('can shuffle a song', async () => {
    // Arrange
    const shuffle = new ShuffleCommand()
    const commandInfo = mockCommandInfo()

    // Act
    await shuffle.run(commandInfo)

    // Assert
    expect(commandInfo.music.shuffle).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalledWith('Shuffled Queue')
  })
})
