import StopCommand from '../../src/commands/stopCommand'
import { mockCommandAdapter } from '../mocks'

describe('The stop command', () => {
  it('can stop playing a song', async () => {
    const commandInfo = mockCommandAdapter()

    // Arrange
    const stop = new StopCommand()

    // Act
    await stop.run(commandInfo)

    // Assert
    expect(commandInfo.music.stop).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })
})
