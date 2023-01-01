import ShuffleCommand from '../../src/commands/shuffleCommand'
import { mockCommandInfo } from '../mocks'

describe('The shuffle command', () => {
  it('can shuffle a song', async () => {
    // Arrange
    const shuffle = new ShuffleCommand()
    const commandInfo = mockCommandInfo('', new Map())

    // Act
    await shuffle.run(commandInfo)

    // Assert
    expect(commandInfo.music.shuffle).toHaveBeenCalled()
  })
})
