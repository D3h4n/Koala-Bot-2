import * as fc from 'fast-check'
import IMusicInteraction from '@domain/IMusicInteraction'
import { mockDistubeClient } from 'src/testFixtures/mocks.test'
import assert from 'assert'

import EmbeddedMessage from 'src/embeds/embeddedMessage'
import QueueMessage from 'src/embeds/queueMessage'
import MusicService from './musicService'
import { ok, isOk, err, isErr } from '@domain/monads/Result'

describe('The Music Service', () => {
  describe('can play music', () => {
    it.each([
      'A fancy song',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://soundcloud.com/gunna/fukumean',
      'https://open.spotify.com/track/3pKVTiMmJY0cEV5iDfYkBI?si=b36ca5c8c851478c',
    ])('successfully', async (query) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: 'A valid guildId',
      }

      const distubeClient = mockDistubeClient()
      distubeClient.play = jest.fn(async () => ok())

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.play(query)

      // Assert
      expect(distubeClient.play).toHaveBeenCalledWith(query, interaction)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([
      err('An error message'),
      err('A longer error message that is very descriptive'),
      ok(),
    ])('and return the correct result', async (expectedResult) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: 'A valid guildId',
      }

      const distubeClient = mockDistubeClient()
      distubeClient.play = jest.fn(async () => expectedResult)

      const query = 'A cool song'

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.play(query)

      // Assert
      expect(distubeClient.play).toHaveBeenCalledWith(query, interaction)
      expect(result).toBe(expectedResult)
    })
  })

  describe('can try to pause a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryPause = jest.fn(async () => ok('Paused queue'))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryPause()

      // Assert
      expect(distubeClient.tryPause).toHaveBeenCalledWith(guildId)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([ok('Paused the queue'), ok('The queue is already paused'), err('No queue was found')])(
      'and return the correct result',
      async (expectedResult) => {
        const guildId = '12312423412342134'
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.tryPause = jest.fn(async () => expectedResult)

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.tryPause()

        // Assert
        expect(distubeClient.tryPause).toHaveBeenCalledWith(guildId)
        expect(result).toBe(expectedResult)
      }
    )

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryPause()

      // Assert
      expect(distubeClient.tryPause).not.toHaveBeenCalled()
      expect(isErr(result)).toBeTruthy()
    })
  })

  describe('can try to resume a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryResume = jest.fn(async () => ok('Resuming song'))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryResume()

      // Assert
      expect(distubeClient.tryResume).toHaveBeenCalledWith(guildId)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([ok('Resuming song'), err('Failed to resume song')])(
      'and return the correct result',
      async (expectedResult) => {
        const guildId = '12312423412342134'
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.tryResume = jest.fn(async () => expectedResult)

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.tryResume()

        // Assert
        expect(distubeClient.tryResume).toHaveBeenCalledWith(guildId)
        expect(result).toBe(expectedResult)
      }
    )

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryResume()

      // Assert
      expect(distubeClient.tryResume).not.toHaveBeenCalled()
      expect(isErr(result)).toBeTruthy()
    })
  })

  describe('can try to shuffle a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryShuffle = jest.fn(async () => ok('Shuffled queue'))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryShuffle()

      // Assert
      expect(distubeClient.tryShuffle).toHaveBeenCalledWith(guildId)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([ok('Shuffled queue'), err('Failed to shuffle queue')])(
      'and return the correct result',
      async (expectedResult) => {
        const guildId = '12312423412342134'
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.tryShuffle = jest.fn(async () => expectedResult)

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.tryShuffle()

        // Assert
        expect(distubeClient.tryShuffle).toHaveBeenCalledWith(guildId)
        expect(result).toBe(expectedResult)
      }
    )

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryShuffle()

      // Assert
      expect(distubeClient.tryShuffle).not.toHaveBeenCalled()
      expect(isErr(result)).toBeTruthy()
    })
  })

  describe('can try to skip a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.trySkip = jest.fn(async () => ok(''))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.trySkip()

      // Assert
      expect(distubeClient.trySkip).toHaveBeenCalledWith(guildId)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([ok(''), err('Failed to skip song')])(
      'and return the correct result',
      async (expectedResult) => {
        const guildId = '12312423412342134'
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.trySkip = jest.fn(async () => expectedResult)

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.trySkip()

        // Assert
        expect(distubeClient.trySkip).toHaveBeenCalledWith(guildId)
        expect(result).toBe(expectedResult)
      }
    )

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.trySkip()

      // Assert
      expect(distubeClient.trySkip).not.toHaveBeenCalled()
      expect(isErr(result)).toBeTruthy()
    })
  })

  describe('can try to stop the queue', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryStop = jest.fn(async () => ok())

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryStop()

      // Assert
      expect(distubeClient.tryStop).toHaveBeenCalledWith(guildId)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([ok(), err('Failed to stop the queue')])(
      'and return the correct result',
      async (expectedResult) => {
        const guildId = '12312423412342134'
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.tryStop = jest.fn(async () => expectedResult)

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.tryStop()

        // Assert
        expect(distubeClient.tryStop).toHaveBeenCalledWith(guildId)
        expect(result).toBe(expectedResult)
      }
    )

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.tryStop()

      // Assert
      expect(distubeClient.tryStop).not.toHaveBeenCalled()
      expect(isErr(result)).toBeTruthy()
    })
  })

  describe('can remove a song', () => {
    it.each([
      [2, '1234123412343241231'],
      [3, '13423423412341234'],
    ])('successfully', async (position, guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const songName = 'A song name'

      const distubeClient = mockDistubeClient()
      distubeClient.remove = jest.fn(async () => ok(songName))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.remove(position)

      // Assert
      expect(distubeClient.remove).toHaveBeenCalledWith(guildId, position)
      expect(isOk(result)).toBeTruthy()
    })

    it.each([err('Failed to remove song'), ok('A song name'), ok('Another song name')])(
      'returns the correct result',
      async (expectedResult) => {
        const guildId = '12341341231231'
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.remove = jest.fn(async () => expectedResult)

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.remove(2)

        // Assert
        expect(distubeClient.remove).toHaveBeenCalledWith(guildId, 2)
        expect(result).toBe(expectedResult)
      }
    )

    it.each([7, 3, 2, 43])('and return null if the guildId is not specified', async (position) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.remove(position)

      // Assert
      expect(distubeClient.remove).not.toHaveBeenCalled()
      expect(isErr(result)).toBeTruthy()
    })
  })

  describe('can handle looping', () => {
    describe('a song', () => {
      it.each(['1234123412343241231', '13423423412341234'])(
        'and returning a successful result',
        async (guildId) => {
          const successResult = ok('Looping song')

          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const distubeClient = mockDistubeClient()
          distubeClient.loop = jest.fn(async () => successResult)

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          const result = await musicService.loop('song')

          // Assert
          expect(distubeClient.loop).toHaveBeenCalledWith(guildId, 'song')
          expect(result).toEqual(successResult)
        }
      )

      it.each(['1234123412343241231', '13423423412341234'])(
        'and returning an error result',
        async (guildId) => {
          const errorResult = err('Failed to loop song')

          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const distubeClient = mockDistubeClient()

          distubeClient.loop = jest.fn(async () => errorResult)

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          const result = await musicService.loop('song')

          // Assert
          expect(distubeClient.loop).toHaveBeenCalledWith(guildId, 'song')
          expect(result).toBe(errorResult)
        }
      )

      it('and returning an error result if no guildId', async () => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId: null,
        }

        const distubeClient = mockDistubeClient()

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.loop('song')

        // Assert
        expect(distubeClient.loop).not.toHaveBeenCalled()
        expect(isErr(result)).toBeTruthy()
      })
    })

    describe('a queue', () => {
      it.each(['1234123412343241231', '13423423412341234'])(
        'and returning a success result',
        async (guildId) => {
          const successResult = ok('Looping queue')

          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const distubeClient = mockDistubeClient()
          distubeClient.loop = jest.fn(async () => successResult)

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          const result = await musicService.loop('queue')

          // Assert
          expect(distubeClient.loop).toHaveBeenCalledWith(guildId, 'queue')
          expect(result).toEqual(successResult)
        }
      )

      it.each(['1234123412343241231', '13423423412341234'])(
        'and returning an error result',
        async (guildId) => {
          const errorResult = err('Failed to loop queue')

          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const distubeClient = mockDistubeClient()

          distubeClient.loop = jest.fn(async () => errorResult)

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          const result = await musicService.loop('queue')

          // Assert
          expect(distubeClient.loop).toHaveBeenCalledWith(guildId, 'queue')
          expect(result).toBe(errorResult)
        }
      )

      it('and returning an error result if no guildId', async () => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId: null,
        }

        const distubeClient = mockDistubeClient()

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.loop('queue')

        // Assert
        expect(distubeClient.loop).not.toHaveBeenCalled()
        expect(isErr(result)).toBeTruthy()
      })
    })

    describe('stopping', () => {
      it.each(['1234123412343241231', '13423423412341234'])(
        'and returning a success result',
        async (guildId) => {
          const successResult = ok('Stopped looping queue')

          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const distubeClient = mockDistubeClient()
          distubeClient.loop = jest.fn(async () => successResult)

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          const result = await musicService.loop('off')

          // Assert
          expect(distubeClient.loop).toHaveBeenCalledWith(guildId, 'off')
          expect(result).toEqual(successResult)
        }
      )

      it.each(['1234123412343241231', '13423423412341234'])(
        'and returning an error result',
        async (guildId) => {
          const errorResult = err('Failed to stop looping queue')

          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const distubeClient = mockDistubeClient()
          distubeClient.loop = jest.fn(async () => errorResult)

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          const result = await musicService.loop('off')

          // Assert
          expect(distubeClient.loop).toHaveBeenCalledWith(guildId, 'off')
          expect(result).toBe(errorResult)
        }
      )

      it('and returning an error result if no guildId', async () => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId: null,
        }

        const distubeClient = mockDistubeClient()

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.loop('off')

        // Assert
        expect(distubeClient.loop).not.toHaveBeenCalled()
        expect(isErr(result)).toBeTruthy()
      })
    })
  })

  describe('can retrieve the queue', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])(
      'without specifying a page',
      async (guildId) => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const embed = new EmbeddedMessage({})

        const distubeClient = mockDistubeClient()
        distubeClient.getQueue = jest.fn(() => ok(embed))

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.getQueue()

        // Assert
        expect(distubeClient.getQueue).toHaveBeenCalledWith(guildId, 1)
        expect(result).toBe(embed)
      }
    )

    it('without specifying a page', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1 }), (page) => {
          const guildId = '1213123132421341'
          const interaction: IMusicInteraction = {
            member: null,
            channel: null,
            guildId,
          }

          const embed = new EmbeddedMessage({})

          const distubeClient = mockDistubeClient()
          distubeClient.getQueue = jest.fn(() => ok(embed))

          // Arrange
          const musicService = new MusicService(interaction, distubeClient)

          // Act
          musicService.getQueue(page).then((result) => {
            // Assert
            expect(distubeClient.getQueue).toHaveBeenCalledWith(guildId, page)
            expect(result).toBe(embed)
          })
        })
      )
    })

    it('returns empty queue when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.getQueue()

      // Assert
      expect(distubeClient.getQueue).not.toHaveBeenCalled()
      expect(result).toStrictEqual(QueueMessage.EmptyQueue)
    })
  })

  describe('can generate the correct message for the currently playing song', () => {
    it.each(['1234123412343241231', '13423423412341234'])(
      'when the guildId is defined',
      async (guildId) => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: null,
          guildId,
        }

        const embed = new EmbeddedMessage({})
        const distubeClient = mockDistubeClient()

        distubeClient.getNowPlaying = jest.fn(() => ok(embed))

        // Arrange
        const musicService = new MusicService(interaction, distubeClient)

        // Act
        const result = await musicService.getNowPlaying()

        // Assert
        expect(result).toBe(embed)
      }
    )

    it('when the guildId is not defined', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.getNowPlaying()

      // Assert
      expect(distubeClient.getNowPlaying).not.toHaveBeenCalled()
      expect(result).toEqual(QueueMessage.EmptyQueue)
    })
  })

  describe('can seek a timestamp', () => {
    it.each([
      ['123412341234123421', '25'],
      ['1234123412343241231', '10:00'],
      ['13423423412341234', '1:00:00'],
    ])('with a valid timestamp', async (guildId, timestamp) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.seek = jest.fn(async () => ok(''))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.seek(timestamp)

      // Assert
      expect(distubeClient.seek).toHaveBeenCalledWith(guildId, timestamp)
      assert(isOk(result))
    })

    it.each([
      ['1234123412343241231', 'asfsdafasd'],
      ['13423423412341234', '1:0:12'],
    ])('and return an err result for invalid timestamps', async (guildId, timestamp) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: null,
        guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.seek = jest.fn(async () => err(''))

      // Arrange
      const musicService = new MusicService(interaction, distubeClient)

      // Act
      const result = await musicService.seek(timestamp)

      // Assert
      expect(distubeClient.seek).toHaveBeenCalledWith(guildId, timestamp)
      assert(isErr(result))
    })
  })
})
