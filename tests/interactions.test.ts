import {
  executeCommand,
  MessageReplier,
  MusicPlayer,
} from '../src/interactions'
import * as fc from 'fast-check'

const nullReplier = {} as MessageReplier
const nullPlayer = {} as MusicPlayer

describe('On receiving a command', () => {
  describe('named echo', () => {
    it('reply with the correct message', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          const replier = nullReplier
          replier.reply = jest.fn()

          // Act
          executeCommand(
            'echo',
            { message },
            {
              messageReplier: replier,
              musicPlayer: nullPlayer,
            }
          )

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
      const replier = nullReplier
      replier.reply = jest.fn()

      const replies = choices.map((choice) => `\`${choice}\``)

      // Act
      const options = {}

      choices.forEach((choice, idx) => {
        options[`choice${idx + 1}`] = choice
      })

      executeCommand('choose', options, {
        messageReplier: replier,
        musicPlayer: nullPlayer,
      })

      // Assert
      expect(replies).toContain((replier.reply as jest.Mock).mock.lastCall[0])
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
            const replier = nullReplier
            replier.reply = jest.fn()

            // Arrange
            jest.spyOn(global.Math, 'random').mockReturnValue(randomValue)

            // Act
            const options = {}

            choices.forEach((choice, idx) => {
              options[`choice${idx + 1}`] = choice
            })

            executeCommand('choose', options, {
              messageReplier: replier,
              musicPlayer: nullPlayer,
            })

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
          const player = nullPlayer
          player.play = jest.fn()

          executeCommand(
            'play',
            { song },
            {
              messageReplier: nullReplier,
              musicPlayer: player,
            }
          )

          expect(player.play).toHaveBeenCalledWith(song)
        })
      )
    })
  })

  describe('named stop', () => {
    it('stop playing a song', () => {
      const player = nullPlayer
      player.stop = jest.fn()

      executeCommand(
        'stop',
        {},
        {
          messageReplier: nullReplier,
          musicPlayer: player,
        }
      )

      expect(player.stop).toHaveBeenCalled()
    })
  })

  describe('named queue', () => {
    it('displays the queue', () => {
      const player = nullPlayer
      player.queue = jest.fn()

      executeCommand(
        'queue',
        {},
        {
          messageReplier: nullReplier,
          musicPlayer: player,
        }
      )

      expect(player.queue).toHaveBeenCalled()
    })

    it('displays the queue at a page', () => {
      const player = nullPlayer
      player.queue = jest.fn()

      executeCommand(
        'queue',
        { page: 2 },
        {
          messageReplier: nullReplier,
          musicPlayer: player,
        }
      )

      expect(player.queue).toHaveBeenCalledWith(2)
    })
  })

  describe('named skip', () => {
    it('skips a song', () => {
      const player = nullPlayer
      player.skip = jest.fn()

      executeCommand(
        'skip',
        {},
        {
          messageReplier: nullReplier,
          musicPlayer: player,
        }
      )

      expect(player.skip).toHaveBeenCalled()
    })
  })

  describe('named shuffle', () => {
    it('shuffles a song', () => {
      const player = nullPlayer
      player.shuffle = jest.fn()

      executeCommand(
        'shuffle',
        {},
        {
          messageReplier: nullReplier,
          musicPlayer: player,
        }
      )

      expect(player.shuffle).toHaveBeenCalled()
    })
  })
})
