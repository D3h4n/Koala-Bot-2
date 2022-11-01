import MessageAdapter, { EmbedAdapter } from '../../src/adapters/MessageAdapter'
import * as fc from 'fast-check'

describe('A message adapter can', () => {
  it('reply with a message', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        const interaction = {
          editReply: jest.fn(),
        }

        // Arrange
        const messageAdapter = new MessageAdapter(interaction)

        // Act
        messageAdapter.reply(message)

        // Assert
        expect(interaction.editReply).toHaveBeenCalledWith(message)
      })
    )
  })

  it('reply with an embedded message', () => {
    const interaction = {
      editReply: jest.fn(),
    }
    const embed = new EmbedAdapter()

    // Arrange
    const messageAdapter = new MessageAdapter(interaction)

    // Act
    messageAdapter.replyWithEmbed(embed)

    // Assert
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [embed._builder],
    })
  })
})
