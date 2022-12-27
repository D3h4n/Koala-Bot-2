import * as fc from 'fast-check'
import PlayCommand from '../../src/commands/playCommand'
import { mockCommandInfo } from '../mocks'

describe('The play command', () => {
  it('can play a song', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (song) => {
        // Act
        const play = new PlayCommand()
        const commandInfo = mockCommandInfo('', new Map([['song', song]]))
        play.run(commandInfo)

        // Assert
        expect(commandInfo.music.play).toHaveBeenCalledWith(song)
      })
    )
  })
})
