import { executeCommand, MessageReplier } from '../src/interactions'
import * as fc from 'fast-check'
import { MusicPlayer } from '../src/adapters/MusicAdapter'

const nullReplier = null as unknown as MessageReplier
const nullPlayer = null as unknown as MusicPlayer

describe('On receiving a command', () => {
  describe('named echo', () => {
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

  describe('named choose', () => {
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

  describe('named play', () => {
    it('play a song', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (song) => {
          const player = {
            play: jest.fn(),
            stop: jest.fn(),
          }

          executeCommand('play', { song }, nullReplier, player)

          expect(player.play).toHaveBeenCalledWith(song)
        })
      )
    })
  })

  describe('named stop', () => {
    it('stop playing a song', () => {
      const player = {
        play: jest.fn(),
        stop: jest.fn(),
      }

      executeCommand('stop', {}, nullReplier, player)

      expect(player.stop).toHaveBeenCalled()
    })
  })
})
