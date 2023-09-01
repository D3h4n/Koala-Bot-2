import MessageAdapter, { IRepliable } from '../../src/adapters/messageAdapter'
import EmbeddedMessage from '../../src/embeds/embeddedMessage'
import * as fc from 'fast-check'

describe('The Message Adapter', () => {
  describe('can reply to an interaction', () => {
    describe('that has not been previously replied to', () => {
      it('with a string', () => {
        fc.assert(
          fc.property(fc.string({ minLength: 1 }), (message) => {
            const interaction: IRepliable = {
              replied: false,
              deferred: false,
              editReply: jest.fn(),
              reply: jest.fn(),
              deferReply: jest.fn(),
              deleteReply: jest.fn(),
            }

            // Arrange
            const messageAdapter = new MessageAdapter(interaction)

            // Act
            messageAdapter.reply(message).then(() => {
              // Assert
              expect(interaction.reply).toHaveBeenCalledWith(message)
            })
          })
        )
      })

      it('with an embedded message', async () => {
        const interaction: IRepliable = {
          replied: false,
          deferred: false,
          editReply: jest.fn(),
          reply: jest.fn(),
          deferReply: jest.fn(),
          deleteReply: jest.fn(),
        }
        const embed = new EmbeddedMessage({
          author: 'D3h4n',
          title: 'Important Announcement',
          description: 'Free pizza for all!!!',
        })

        // Arrange
        const messageAdapter = new MessageAdapter(interaction)

        // Act
        await messageAdapter.reply(embed)

        // Assert
        expect(interaction.reply).toHaveBeenCalledWith({ embeds: [embed.embed] })
      })
    })

    describe('that has been previously replied to', () => {
      it('with a string', () => {
        fc.assert(
          fc.property(fc.string({ minLength: 1 }), (message) => {
            const interaction: IRepliable = {
              replied: true,
              deferred: false,
              editReply: jest.fn(),
              reply: jest.fn(),
              deferReply: jest.fn(),
              deleteReply: jest.fn(),
            }

            // Arrange
            const messageAdapter = new MessageAdapter(interaction)

            // Act
            messageAdapter.reply(message).then(() => {
              // Assert
              expect(interaction.editReply).toHaveBeenCalledWith(message)
            })
          })
        )
      })

      it('with an embbedded message', async () => {
        const interaction: IRepliable = {
          replied: true,
          deferred: false,
          editReply: jest.fn(),
          reply: jest.fn(),
          deferReply: jest.fn(),
          deleteReply: jest.fn(),
        }

        const embed = new EmbeddedMessage({
          author: 'D3h4n',
          title: 'Important Announcement',
          description: 'Free pizza for all!!!',
        })

        // Arrange
        const messageAdapter = new MessageAdapter(interaction)

        // Act
        await messageAdapter.reply(embed)

        // Assert
        expect(interaction.editReply).toHaveBeenCalledWith({ embeds: [embed.embed] })
      })
    })

    describe('that has been deferred', () => {
      it('with a string', () => {
        fc.assert(
          fc.property(fc.string({ minLength: 1 }), (message) => {
            const interaction: IRepliable = {
              replied: false,
              deferred: true,
              editReply: jest.fn(),
              reply: jest.fn(),
              deferReply: jest.fn(),
              deleteReply: jest.fn(),
            }

            // Arrange
            const messageAdapter = new MessageAdapter(interaction)

            // Act
            messageAdapter.reply(message).then(() => {
              // Assert
              expect(interaction.editReply).toHaveBeenCalledWith(message)
            })
          })
        )
      })

      it('with an embedded message', async () => {
        const interaction: IRepliable = {
          replied: false,
          deferred: true,
          editReply: jest.fn(),
          reply: jest.fn(),
          deferReply: jest.fn(),
          deleteReply: jest.fn(),
        }
        const embed = new EmbeddedMessage({
          author: 'D3h4n',
          title: 'Important Announcement',
          description: 'Free pizza for all!!!',
        })

        const messageAdapter = new MessageAdapter(interaction)

        await messageAdapter.reply(embed)

        expect(interaction.editReply).toHaveBeenCalledWith({ embeds: [embed.embed] })
      })
    })
  })

  describe('can signal no reply for an interaction', () => {
    it('that has not previously been replied to', async () => {
      const interaction: IRepliable = {
        replied: false,
        deferred: false,
        editReply: jest.fn(),
        reply: jest.fn(),
        deferReply: jest.fn(),
        deleteReply: jest.fn(),
      }

      // Arrange
      const messageAdapter = new MessageAdapter(interaction)

      // Act
      await messageAdapter.noReply()

      // Assert
      expect(interaction.deferReply).toHaveBeenCalled()
      expect(interaction.deleteReply).toHaveBeenCalled()
    })

    it('that has previously been replied to', async () => {
      const interaction: IRepliable = {
        replied: true,
        deferred: false,
        editReply: jest.fn(),
        reply: jest.fn(),
        deferReply: jest.fn(),
        deleteReply: jest.fn(),
      }

      // Arrange
      const messageAdapter = new MessageAdapter(interaction)

      // Act
      await messageAdapter.noReply()

      // Assert
      expect(interaction.deferReply).not.toHaveBeenCalled()
      expect(interaction.deleteReply).toHaveBeenCalled()
    })

    it('that has previously been deferred', async () => {
      const interaction: IRepliable = {
        replied: false,
        deferred: true,
        editReply: jest.fn(),
        reply: jest.fn(),
        deferReply: jest.fn(),
        deleteReply: jest.fn(),
      }

      // Arrange
      const messageAdapter = new MessageAdapter(interaction)

      // Act
      await messageAdapter.noReply()

      // Assert
      expect(interaction.deferReply).not.toHaveBeenCalled()
      expect(interaction.deleteReply).toHaveBeenCalled()
    })
  })

  describe('can defer a reply to an interaction', () => {
    it('that has not previously been deferred or replied to', async () => {
      const interaction: IRepliable = {
        replied: false,
        deferred: false,
        editReply: jest.fn(),
        reply: jest.fn(),
        deferReply: jest.fn(),
        deleteReply: jest.fn(),
      }

      // Arrange
      const messageAdapter = new MessageAdapter(interaction)

      // Act
      await messageAdapter.defer()

      // Assert
      expect(interaction.deferReply).toHaveBeenCalled()
    })

    it('that has previously been deferred', async () => {
      const interaction: IRepliable = {
        replied: false,
        deferred: true,
        editReply: jest.fn(),
        reply: jest.fn(),
        deferReply: jest.fn(),
        deleteReply: jest.fn(),
      }

      // Arrange
      const messageAdapter = new MessageAdapter(interaction)

      // Act
      await messageAdapter.defer()

      // Assert
      expect(interaction.deferReply).not.toHaveBeenCalled()
    })

    it('that has previously been replied to', async () => {
      const interaction: IRepliable = {
        replied: true,
        deferred: false,
        editReply: jest.fn(),
        reply: jest.fn(),
        deferReply: jest.fn(),
        deleteReply: jest.fn(),
      }

      // Arrange
      const messageAdapter = new MessageAdapter(interaction)

      // Act
      await messageAdapter.defer()

      // Assert
      expect(interaction.deferReply).not.toHaveBeenCalled()
    })
  })
})
