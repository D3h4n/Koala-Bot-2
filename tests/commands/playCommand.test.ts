import * as fc from 'fast-check'
import PlayCommand from '../../src/commands/playCommand'
import { mockCommandInfo } from '../mocks'

describe('The play command', () => {
  it('can play a song', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (song) => {
        // Arrange
        const play = new PlayCommand()
        const commandInfo = mockCommandInfo('', new Map([['song', song]]))

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        play.run(commandInfo).then(() => {
          // Assert
          expect(commandInfo.message.defer).toHaveBeenCalled()
          expect(commandInfo.music.play).toHaveBeenCalledWith(song)
          expect(commandInfo.message.noReply).toHaveBeenCalled()
        })
      })
    )
  })
})
