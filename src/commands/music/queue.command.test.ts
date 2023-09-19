import * as fc from 'fast-check'

import {
  mockMessageService,
  mockMusicService,
  mockVoiceService,
} from '../../testFixtures/mocks.test'
import EmbeddedMessage from 'src/embeds/embeddedMessage'
import ServiceProvider from '@services/serviceProvider'
import QueueCommand from './queue.command'

describe('The queue command', () => {
  it('can display the queue', () => {
    const embed = new EmbeddedMessage({})
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
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
          mockMessageService(),
          mockMusicService(),
          mockVoiceService()
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
