import * as fc from 'fast-check'
import PlayCommand from '../../src/commands/playCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'
import CommandAdapter from '../../src/adapters/commandAdapter'

describe('The play command', () => {
  it('can play a song', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (song) => {
        // Arrange
        const play = new PlayCommand()
        const commandAdapter = new CommandAdapter(
          new Map([['song', song]]),
          messageAdapter(),
          musicAdapter(),
          voiceAdapter()
        )

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        play.run(commandAdapter).then(() => {
          // Assert
          expect(commandAdapter.message.defer).toHaveBeenCalled()
          expect(commandAdapter.music.play).toHaveBeenCalledWith(song)
          expect(commandAdapter.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })
})
