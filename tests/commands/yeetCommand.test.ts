import CommandAdapter from '../../src/adapters/commandAdapter'
import YeetCommand from '../../src/commands/yeetCommand'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'
import * as fc from 'fast-check'

describe('The yeet command', () => {
  it('can move all users to a voice channel', async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (channel) => {
        const options = new Map([['channel', channel]])
        const commandAdapter = new CommandAdapter(
          mockMessageAdapter(),
          mockMusicAdapter(),
          mockVoiceAdapter()
        )

        // Arrange
        const yeet = new YeetCommand()

        // Act
        yeet.run(commandAdapter, options).then(() => {
          // Assert
          expect(commandAdapter.voice.moveAll).toHaveBeenCalledWith(channel)
          expect(commandAdapter.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })
})
