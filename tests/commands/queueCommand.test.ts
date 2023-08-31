import QueueCommand from '../../src/commands/queueCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'
import * as fc from 'fast-check'
import EmbeddedMessage from '../../src/embeds/embeddedMessage'
import CommandAdapter from '../../src/adapters/commandAdapter'

describe('The queue command', () => {
  it('can display the queue', () => {
    const embed = new EmbeddedMessage({})
    const commandAdapter = new CommandAdapter(
      new Map(),
      messageAdapter(),
      musicAdapter(),
      voiceAdapter()
    )
    commandAdapter.music.getQueue = jest.fn(() => embed)

    // Assemble
    const queue = new QueueCommand()

    // Act
    queue.run(commandAdapter)

    // Assert
    expect(commandAdapter.music.getQueue).toHaveBeenCalled()
    expect(commandAdapter.message.reply).toHaveBeenCalledWith(embed)
  })

  it('can display the queue at a page', () => {
    fc.assert(
      fc.property(fc.nat(), (page) => {
        const commandAdapter = new CommandAdapter(
          new Map([['page', page]]),
          messageAdapter(),
          musicAdapter(),
          voiceAdapter()
        )
        const embed = new EmbeddedMessage({})
        commandAdapter.music.getQueue = jest.fn(() => embed)

        // Arrange
        const queue = new QueueCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        queue.run(commandAdapter).then(() => {
          // Assert
          expect(commandAdapter.music.getQueue).toHaveBeenCalledWith(page)
          expect(commandAdapter.message.reply).toHaveBeenCalledWith(embed)
        })
      })
    )
  })
})
