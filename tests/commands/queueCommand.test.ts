import QueueCommand from '../../src/commands/queueCommand'
import { mockCommandInfo } from '../mocks'
import * as fc from 'fast-check'

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
        // Act
        const queue = new QueueCommand()
        const commandInfo = mockCommandInfo('', new Map([['page', page]]))
        queue.run(commandInfo)

        // Assert
        expect(commandInfo.music.queue).toHaveBeenCalledWith(page)
      })
    )
  })
})
