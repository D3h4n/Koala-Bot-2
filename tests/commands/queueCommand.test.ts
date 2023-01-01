import QueueCommand from '../../src/commands/queueCommand'
import { mockCommandInfo } from '../mocks'
import * as fc from 'fast-check'
import { EmbeddedMessage } from '../../src/adapters/messageAdapter'

describe('The queue command', () => {
  it('can display the queue', () => {
    // Act
    const queue = new QueueCommand()
    const commandInfo = mockCommandInfo()
    queue.run(commandInfo)

    // Assert
    expect(commandInfo.music.queue).toHaveBeenCalled()
  })

  it('can display the queue at a page', () => {
    fc.assert(
      fc.property(fc.nat(), (page) => {
        const embed = new EmbeddedMessage({})

        // Arrange
        const queue = new QueueCommand()
        const commandInfo = mockCommandInfo('', new Map([['page', page]]))

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        queue.run(commandInfo).then(() => {
          // Assert
          expect(commandInfo.music.queue).toHaveBeenCalledWith(page)
          expect(commandInfo.message.reply).toHaveBeenCalledWith(embed)
        })
      })
    )
  })
})
