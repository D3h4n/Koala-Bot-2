import QueueCommand from '../../src/commands/queueCommand'
import { mockCommandAdapter } from '../mocks'
import * as fc from 'fast-check'
import EmbeddedMessage from '../../src/adapters/embeddedMessage'

describe('The queue command', () => {
  it('can display the queue', () => {
    const embed = new EmbeddedMessage({})
    const commandInfo = mockCommandAdapter()
    commandInfo.music.queue = jest.fn(() => embed)

    // Assemble
    const queue = new QueueCommand()

    // Act
    queue.run(commandInfo)

    // Assert
    expect(commandInfo.music.queue).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalledWith(embed)
  })

  it('can display the queue at a page', () => {
    fc.assert(
      fc.property(fc.nat(), (page) => {
        const commandInfo = mockCommandAdapter('', new Map([['page', page]]))
        const embed = new EmbeddedMessage({})
        commandInfo.music.queue = jest.fn(() => embed)

        // Arrange
        const queue = new QueueCommand()

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
