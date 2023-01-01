import StopCommand from '../../src/commands/stopCommand'
import { mockCommandInfo } from '../mocks'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    // Act
    const stop = new StopCommand()
    const commandInfo = mockCommandInfo()
    await stop.run(commandInfo)

    // Assert
    expect(commandInfo.music.stop).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })
})
