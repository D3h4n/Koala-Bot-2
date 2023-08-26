import RemoveCommand from '../../src/commands/removeCommand'
import { mockCommandInfo } from '../mocks'
import * as fc from 'fast-check'

describe('The remove command', () => {
  it('can remove a song', () => {
    fc.assert(
      fc.property(fc.nat(), (position) => {
        const commandInfo = mockCommandInfo()
        commandInfo.music.remove = jest.fn(async () => 'Famous Song')
        commandInfo.options.set('position', position)

        // Arrange
        const remove = new RemoveCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        remove.run(commandInfo).then(() => {
          // Assert
          expect(commandInfo.music.remove).toHaveBeenCalledWith(position)
          expect(commandInfo.message.reply).toHaveBeenCalled()
          expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
        })
      })
    )
  })
})
