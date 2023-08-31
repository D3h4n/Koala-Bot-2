import * as fc from 'fast-check'
import PlayCommand from '../../src/commands/playCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'
import CommandAdapter from '../../src/adapters/commandAdapter'

describe('The play command', () => {
  it('can play a song', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (song) => {
        const options = new Map([['song', song]])
        const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

        // Arrange
        const play = new PlayCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        play.run(options, commandAdapter).then(() => {
          // Assert
          expect(commandAdapter.message.defer).toHaveBeenCalled()
          expect(commandAdapter.music.play).toHaveBeenCalledWith(song)
          expect(commandAdapter.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })
})
