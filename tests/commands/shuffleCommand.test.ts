import ShuffleCommand from '../../src/commands/shuffleCommand'
import { mockCommandInfo } from '../mocks.test'

describe('The shuffle command', () => {
  it('can shuffle a song', () => {
    // Act
    const shuffle = new ShuffleCommand()
    const commandInfo = mockCommandInfo('', new Map())
    shuffle.run(commandInfo)

    // Assert
    expect(commandInfo.music.shuffle).toHaveBeenCalled()
  })
})
