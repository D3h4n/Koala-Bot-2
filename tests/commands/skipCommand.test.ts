import SkipCommand from '../../src/commands/skipCommand'
import { mockCommandAdapter } from '../mocks'

describe('The skip command', () => {
  it('can skip a song', async () => {
    const commandInfo = mockCommandAdapter()

    // Arrange
    const skip = new SkipCommand()

    // Act
    await skip.run(commandInfo)

    // Assert
    expect(commandInfo.music.skip).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })
})
