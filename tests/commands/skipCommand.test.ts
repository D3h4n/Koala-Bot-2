import SkipCommand from '../../src/commands/skipCommand'
import { mockCommandInfo } from '../mocks'

describe('The skip command', () => {
  it('can skip a song', () => {
    // Act
    const skip = new SkipCommand()
    const commandInfo = mockCommandInfo('', new Map())
    skip.run(commandInfo)

    // Assert
    expect(commandInfo.music.skip).toHaveBeenCalled()
  })
})
