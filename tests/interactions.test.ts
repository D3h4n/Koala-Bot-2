import {
  executeCommand,
  MessageReplier,
  MusicPlayer,
} from '../src/interactions'
import * as fc from 'fast-check'

const nullReplier = null as unknown as MessageReplier
const nullPlayer = null as unknown as MusicPlayer

describe('On receiving a command', () => {
  describe('with the name echo', () => {
    it('reply with the correct message', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          const replier = {
            reply: jest.fn(),
          }

          // Act
          executeCommand('echo', { message }, replier, nullPlayer)

          // Assert
          expect(replier.reply).toHaveBeenCalledWith(message)
        })
      )
    })
  })

  describe('with the name choose', () => {
    it.each([
      [['Hello World', '1234']],
      [['Flight', 'Invisibility', 'Invincibility', 'Super Genius']],
    ])('reply with a correctly formatted choice', (choices) => {
      const replier = {
        reply: jest.fn(),
      }

      const replies = choices.map((choice) => `\`${choice}\``)

      // Act
      const options = {}

      choices.forEach((choice, idx) => {
        options[`choice${idx + 1}`] = choice
      })

      executeCommand('choose', options, replier, nullPlayer)

      // Assert
      expect(replies).toContain(replier.reply.mock.lastCall[0])
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
            const replier = {
              reply: jest.fn(),
            }

            // Arrange
            jest.spyOn(global.Math, 'random').mockReturnValue(randomValue)

            // Act
            const options = {}

            choices.forEach((choice, idx) => {
              options[`choice${idx + 1}`] = choice
            })

            executeCommand('choose', options, replier, nullPlayer)

            // Assert
            const expectedIndex = Math.floor(randomValue * choices.length)
            expect(replier.reply).toHaveBeenCalledWith(
              `\`${choices[expectedIndex]}\``
            )
          }
        )
      )
    })
  })
})

describe('with the name play', () => {
  it('start playing a song in a voice channel', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (song) => {
        const player = {
          play: jest.fn(),
        }

        executeCommand('play', { song }, nullReplier, player)

        expect(player.play).toHaveBeenCalledWith(song)
      })
    )
  })
})
