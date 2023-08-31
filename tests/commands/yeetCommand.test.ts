import CommandAdapter from '../../src/adapters/commandAdapter'
import YeetCommand from '../../src/commands/yeetCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'
import * as fc from 'fast-check'

describe('The yeet command', () => {
  it('can move all users to a voice channel', async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (channel) => {
        const options = new Map([['channel', channel]])
        const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

        // Arrange
        const yeet = new YeetCommand()

        // Act
        yeet.run(options, commandAdapter).then(() => {
          // Assert
          expect(commandAdapter.voice.moveAll).toHaveBeenCalledWith(channel)
          expect(commandAdapter.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })
})
