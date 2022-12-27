import RemoveCommand from '../../src/commands/removeCommand'
import { mockCommandInfo } from '../mocks.test'
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
        remove.run(commandInfo)

        // Assert
        expect(commandInfo.music.remove).toHaveBeenCalledWith(position)
      })
    )
  })
})
