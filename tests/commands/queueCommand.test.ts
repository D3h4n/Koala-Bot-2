import * as fc from 'fast-check'
import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import EmbeddedMessage from '../../src/embeds/embeddedMessage'
import QueueCommand from '../../src/commands/queueCommand'

describe('The queue command', () => {
  it('can display the queue', () => {
    const embed = new EmbeddedMessage({})
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )
    serviceProvider.music.getQueue = jest.fn(() => embed)

    // Assemble
    const queue = new QueueCommand()

    // Act
    queue.run(serviceProvider, new Map())

    // Assert
    expect(serviceProvider.music.getQueue).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(embed)
  })

  it('can display the queue at a page', () => {
    fc.assert(
      fc.property(fc.nat(), (page) => {
        const options = new Map([['page', page]])
        const serviceProvider = new ServiceProvider(
          mockMessageAdapter(),
          mockMusicAdapter(),
          mockVoiceAdapter()
        )
        const embed = new EmbeddedMessage({})
        serviceProvider.music.getQueue = jest.fn(() => embed)

        // Arrange
        const queue = new QueueCommand()

        // Act
        // Note: for consistency, need to wait on async command to run completely before
        // assertions but can't use async await with fast-check
        queue.run(serviceProvider, options).then(() => {
          // Assert
          expect(serviceProvider.music.getQueue).toHaveBeenCalledWith(page)
          expect(serviceProvider.message.reply).toHaveBeenCalledWith(embed)
        })
      })
    )
  })
})
