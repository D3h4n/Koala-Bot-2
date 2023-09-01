import MusicAdapter from '../../src/adapters/musicAdapter'
import EmbeddedMessage from '../../src/embeds/embeddedMessage'
import QueueMessage from '../../src/embeds/queueMessage'
import { IMusicInteraction } from '../../src/services/distubeClient'
import { mockDistubeClient } from '../mocks'
import * as fc from 'fast-check'

describe('The Music Adapter', () => {
  describe('can play music', () => {
    it.each([
      'A fancy song',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://soundcloud.com/gunna/fukumean',
      'https://open.spotify.com/track/3pKVTiMmJY0cEV5iDfYkBI?si=b36ca5c8c851478c',
    ])('successfully', async (query) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: 'A valid guildId',
      }

      const distubeClient = mockDistubeClient()
      distubeClient.play = jest.fn(async () => null)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.play(query)

      // Assert
      expect(distubeClient.play).toHaveBeenCalledWith(query, interaction)
      expect(result).toBe(null)
    })

    it.each(['An error message', 'A longer error message that is very descriptive', null])(
      'and return the correct result',
      async (expectedResult) => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: undefined,
          guildId: 'A valid guildId',
        }

        const distubeClient = mockDistubeClient()
        distubeClient.play = jest.fn(async () => expectedResult)

        const query = 'A cool song'

        // Arrange
        const musicAdapter = new MusicAdapter(interaction, distubeClient)

        // Act
        const result = await musicAdapter.play(query)

        // Assert
        expect(distubeClient.play).toHaveBeenCalledWith(query, interaction)
        expect(result).toBe(expectedResult)
      }
    )
  })

  describe('can try to pause a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryPause = jest.fn(async () => true)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryPause()

      // Assert
      expect(distubeClient.tryPause).toHaveBeenCalledWith(guildId)
      expect(result).toBe(true)
    })

    it.each([true, false])('and return the correct result', async (expectedResult) => {
      const guildId = '12312423412342134'
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryPause = jest.fn(async () => expectedResult)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryPause()

      // Assert
      expect(distubeClient.tryPause).toHaveBeenCalledWith(guildId)
      expect(result).toBe(expectedResult)
    })

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryPause()

      // Assert
      expect(distubeClient.tryPause).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('can try to resume a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryResume = jest.fn(async () => true)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryResume()

      // Assert
      expect(distubeClient.tryResume).toHaveBeenCalledWith(guildId)
      expect(result).toBe(true)
    })

    it.each([true, false])('and return the correct result', async (expectedResult) => {
      const guildId = '12312423412342134'
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryResume = jest.fn(async () => expectedResult)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryResume()

      // Assert
      expect(distubeClient.tryResume).toHaveBeenCalledWith(guildId)
      expect(result).toBe(expectedResult)
    })

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryResume()

      // Assert
      expect(distubeClient.tryResume).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('can retrieve the queue', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])(
      'without specifying a page',
      (guildId) => {
        const interaction: IMusicInteraction = {
          member: null,
          channel: undefined,
          guildId: guildId,
        }

        const embed = new EmbeddedMessage({})

        const distubeClient = mockDistubeClient()
        distubeClient.getQueue = jest.fn(() => embed)

        // Arrange
        const musicAdapter = new MusicAdapter(interaction, distubeClient)

        // Act
        const result = musicAdapter.getQueue()

        // Assert
        expect(distubeClient.getQueue).toHaveBeenCalledWith(1, guildId)
        expect(result).toBe(embed)
      }
    )

    it('without specifying a page', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1 }), (page) => {
          const guildId = '1213123132421341'
          const interaction: IMusicInteraction = {
            member: null,
            channel: undefined,
            guildId: guildId,
          }

          const embed = new EmbeddedMessage({})

          const distubeClient = mockDistubeClient()
          distubeClient.getQueue = jest.fn(() => embed)

          // Arrange
          const musicAdapter = new MusicAdapter(interaction, distubeClient)

          // Act
          const result = musicAdapter.getQueue(page)

          // Assert
          expect(distubeClient.getQueue).toHaveBeenCalledWith(page, guildId)
          expect(result).toBe(embed)
        })
      )
    })

    it('returns empty queue when guildId not specified', () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = musicAdapter.getQueue()

      // Assert
      expect(distubeClient.getQueue).not.toHaveBeenCalled()
      expect(result).toStrictEqual(QueueMessage.EmptyQueue)
    })
  })

  describe('can try to shuffle a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryShuffle = jest.fn(async () => true)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryShuffle()

      // Assert
      expect(distubeClient.tryShuffle).toHaveBeenCalledWith(guildId)
      expect(result).toBe(true)
    })

    it.each([true, false])('and return the correct result', async (expectedResult) => {
      const guildId = '12312423412342134'
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryShuffle = jest.fn(async () => expectedResult)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryShuffle()

      // Assert
      expect(distubeClient.tryShuffle).toHaveBeenCalledWith(guildId)
      expect(result).toBe(expectedResult)
    })

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryShuffle()

      // Assert
      expect(distubeClient.tryShuffle).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('can try to skip a song', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.trySkip = jest.fn(async () => true)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.trySkip()

      // Assert
      expect(distubeClient.trySkip).toHaveBeenCalledWith(guildId)
      expect(result).toBe(true)
    })

    it.each([true, false])('and return the correct result', async (expectedResult) => {
      const guildId = '12312423412342134'
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.trySkip = jest.fn(async () => expectedResult)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.trySkip()

      // Assert
      expect(distubeClient.trySkip).toHaveBeenCalledWith(guildId)
      expect(result).toBe(expectedResult)
    })

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.trySkip()

      // Assert
      expect(distubeClient.trySkip).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('can try to stop the queue', () => {
    it.each(['2134812341234321423', '3141232312423412341324'])('successfully', async (guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryStop = jest.fn(async () => true)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryStop()

      // Assert
      expect(distubeClient.tryStop).toHaveBeenCalledWith(guildId)
      expect(result).toBe(true)
    })

    it.each([true, false])('and return the correct result', async (expectedResult) => {
      const guildId = '12312423412342134'
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const distubeClient = mockDistubeClient()
      distubeClient.tryStop = jest.fn(async () => expectedResult)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryStop()

      // Assert
      expect(distubeClient.tryStop).toHaveBeenCalledWith(guildId)
      expect(result).toBe(expectedResult)
    })

    it('returns false when guildId not specified', async () => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.tryStop()

      // Assert
      expect(distubeClient.tryStop).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('can remove a song', () => {
    it.each([
      [2, '1234123412343241231'],
      [3, '13423423412341234'],
    ])('successfully', async (position, guildId) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: guildId,
      }

      const songName = 'A song name'

      const distubeClient = mockDistubeClient()
      distubeClient.remove = jest.fn(async () => songName)

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.remove(position)

      // Assert
      expect(distubeClient.remove).toHaveBeenCalledWith(position, guildId)
      expect(result).toBe(songName)
    })

    it.each([null, 'A song name', 'Another song name'])(
      'returns the correct result',
      async (expectedResult) => {
        const guildId = '12341341231231'
        const interaction: IMusicInteraction = {
          member: null,
          channel: undefined,
          guildId: guildId,
        }

        const distubeClient = mockDistubeClient()
        distubeClient.remove = jest.fn(async () => expectedResult)

        // Arrange
        const musicAdapter = new MusicAdapter(interaction, distubeClient)

        // Act
        const result = await musicAdapter.remove(2)

        // Assert
        expect(distubeClient.remove).toHaveBeenCalledWith(2, guildId)
        expect(result).toBe(expectedResult)
      }
    )

    it.each([7, 3, 2, 43])('and return null if the guildId is not specified', async (position) => {
      const interaction: IMusicInteraction = {
        member: null,
        channel: undefined,
        guildId: null,
      }

      const distubeClient = mockDistubeClient()

      // Arrange
      const musicAdapter = new MusicAdapter(interaction, distubeClient)

      // Act
      const result = await musicAdapter.remove(position)

      // Assert
      expect(distubeClient.remove).not.toHaveBeenCalled()
      expect(result).toBe(null)
    })
  })
})
