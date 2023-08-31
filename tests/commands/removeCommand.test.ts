import CommandAdapter from '../../src/adapters/commandAdapter'
import RemoveCommand from '../../src/commands/removeCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'
import * as fc from 'fast-check'

describe('The remove command', () => {
  it('can remove a song', () => {
    fc.assert(
      fc.property(fc.nat(), (position) => {
        const commandAdapter = new CommandAdapter(
          new Map([['position', position]]),
          messageAdapter(),
          musicAdapter(),
          voiceAdapter()
        )
        commandAdapter.music.remove = jest.fn(async () => 'Famous Song')

        // Arrange
        const remove = new RemoveCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        remove.run(commandAdapter).then(() => {
          // Assert
          expect(commandAdapter.music.remove).toHaveBeenCalledWith(position)
          expect(commandAdapter.message.reply).toHaveBeenCalled()
          expect(typeof (<jest.Mock>commandAdapter.message.reply).mock.lastCall?.[0]).toBe('string')
        })
      })
    )
  })
})
