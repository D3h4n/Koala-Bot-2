import SkipCommand from '../../src/commands/skipCommand'
import { mockCommandInfo } from '../mocks'

describe('The skip command', () => {
  it('can skip a song', async () => {
    // Act
    const skip = new SkipCommand()
    const commandInfo = mockCommandInfo('', new Map())
    await skip.run(commandInfo)

    // Assert
    expect(commandInfo.music.skip).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })
})
