import ChooseCommand from '../../src/commands/chooseCommand'
import * as fc from 'fast-check'
import { mockCommandInfo } from '../mocks'

describe('The choose command', () => {
  it.each([
    [['Hello World', '1234']],
    [['Flight', 'Invisibility', 'Invincibility', 'Super Genius']],
  ])('reply with a correctly formatted choice', async (choices) => {
    const options = new Map()
    choices.forEach((choice, idx) => {
      options.set(`choice${idx + 1}`, choice)
    })

    const replies = choices.map((choice) => `\`${choice}\``)

    // Act
    const choose = new ChooseCommand()
    const commandInfo = mockCommandInfo('', options)
    await choose.run(commandInfo)

    // Assert
    expect(replies).toContain((commandInfo.message.reply as jest.Mock).mock.lastCall?.[0])
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
          const options = new Map()
          choices.forEach((choice, idx) => {
            options.set(`choice${idx + 1}`, choice)
          })

          // Arrange
          jest.spyOn(global.Math, 'random').mockReturnValue(randomValue)
          const choose = new ChooseCommand()
          const commandInfo = mockCommandInfo('', options)

          // Act
          // Note: for consistency, need to wait on async command to run completely before
          // assertions but can't use async await with fast-check
          choose.run(commandInfo).then(() => {
            // Assert
            const expectedIndex = Math.floor(randomValue * choices.length)
            expect(commandInfo.message.reply).toHaveBeenCalledWith(`\`${choices[expectedIndex]}\``)
          })
        }
      )
    )
  })
})
