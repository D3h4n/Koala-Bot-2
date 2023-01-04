import YeetCommand from '../../src/commands/yeetCommand'
import { mockCommandInfo } from '../mocks'
import * as fc from 'fast-check'

describe('The yeet command', () => {
  it('can move all users to a voice channel', async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (channel) => {
        // Arrange
        const options = new Map([['channel', channel]])
        const commandInfo = mockCommandInfo('yeet', options)

        // Act
        const yeet = new YeetCommand()
        yeet.run(commandInfo).then(() => {
          // Assert
          expect(commandInfo.voice.moveAll).toHaveBeenCalledWith(channel)
          expect(commandInfo.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })
})
