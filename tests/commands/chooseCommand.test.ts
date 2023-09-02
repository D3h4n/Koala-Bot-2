import * as fc from 'fast-check'
import { mockMessageService, mockMusicService, mockVoiceService } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import ChooseCommand from '../../src/commands/chooseCommand'

describe('The choose command', () => {
  it.each([
    [['Hello World', '1234']],
    [['Flight', 'Invisibility', 'Invincibility', 'Super Genius']],
  ])('reply with a correctly formatted choice', async (choices) => {
    const options = new Map<string, string>(
      choices.map((choice, idx) => [`choice${idx + 1}`, choice])
    )
    const replies = choices.map((choice) => `\`${choice}\``)

    // Act
    const choose = new ChooseCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    await choose.run(serviceProvider, options)

    // Assert
    expect(replies).toContain((serviceProvider.message.reply as jest.Mock).mock.lastCall?.[0])
  })

  it('reply with a random choice from the given options', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), {
          minLength: 2,
          maxLength: 10,
        }),
        fc.float({ min: 0, max: 1 }),
        (choices, randomValue) => {
          const options = new Map<string, string>(
            choices.map((choice, idx) => [`choice${idx + 1}`, choice])
          )

          // Arrange
          jest.spyOn(global.Math, 'random').mockReturnValue(randomValue)
          const choose = new ChooseCommand()
          const serviceProvider = new ServiceProvider(
            mockMessageService(),
            mockMusicService(),
            mockVoiceService()
          )

          // Act
          // Note: for consistency, need to wait on async command to run completely before
          // assertions but can't use async await with fast-check
          choose.run(serviceProvider, options).then(() => {
            // Assert
            const expectedIndex = Math.floor(randomValue * choices.length)
            expect(serviceProvider.message.reply).toHaveBeenCalledWith(
              `\`${choices[expectedIndex]}\``
            )
          })
        }
      )
    )
  })
})
