import RemoveCommand from '../../src/commands/removeCommand'
import { mockCommandInfo } from '../mocks'
import * as fc from 'fast-check'

describe('The remove command', () => {
  it('can remove a song', () => {
    fc.assert(
      fc.property(fc.nat(), (position) => {
        // Arrange
        const remove = new RemoveCommand()
        const commandInfo = mockCommandInfo()
        commandInfo.options.set('position', position)

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        remove.run(commandInfo).then(() => {
          // Assert
          expect(commandInfo.music.remove).toHaveBeenCalledWith(position)
        })
      })
    )
  })
})
