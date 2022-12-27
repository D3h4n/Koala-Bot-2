import StopCommand from '../../src/commands/stopCommand'
import { mockCommandInfo } from '../mocks.test'

describe('The stop command', () => {
  it('can stop playing a song', () => {
    // Act
    const stop = new StopCommand()
    const commandInfo = mockCommandInfo()
    stop.run(commandInfo)

    // Assert
    expect(commandInfo.music.stop).toHaveBeenCalled()
  })
})
