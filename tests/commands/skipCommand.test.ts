import SkipCommand from '../../src/commands/skipCommand'
import { mockCommandInfo } from '../mocks'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const commandInfo = mockCommandInfo()

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(commandInfo)

    // Assert
    expect(commandInfo.music.skip).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })
})
