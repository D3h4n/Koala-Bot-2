import VoiceService, { IVoiceInteraction, VoiceMember } from '../../src/services/voiceService'
import { PermissionsBitField } from 'discord.js'
import * as fc from 'fast-check'

describe('The Voice Service', () => {
  it('can move members between voice channels', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.string({ minLength: 2 }),
        (numMembers, channel) => {
          const membersToMove: VoiceMember[] = Array.from({ length: numMembers }, () => ({
            permissions: new PermissionsBitField(),
            voice: {
              channel: null,
              setChannel: jest.fn(),
            },
          }))

          const interaction: IVoiceInteraction = {
            member: {
              permissions: new PermissionsBitField().add('MoveMembers'),
              voice: {
                channel: {
                  members: new Map(membersToMove.map((member, idx) => [idx.toString(), member])),
                },
                setChannel: jest.fn(),
              },
            },
          }

          // Arrange
          const voiceService = new VoiceService(interaction)

          // Act
          voiceService.moveAll(channel).then((result) => {
            // Assert
            expect(result).toEqual(null)

            membersToMove.forEach((movedMember) =>
              expect(movedMember.voice.setChannel).toHaveBeenCalledWith(
                channel,
                'performed yeet command'
              )
            )
          })
        }
      )
    )
  })

  describe('fails if', () => {
    it('member does not have the correct permissions', async () => {
      const movedMember: VoiceMember = {
        permissions: new PermissionsBitField(),
        voice: {
          channel: null,
          setChannel: jest.fn(),
        },
      }

      const interaction: IVoiceInteraction = {
        member: {
          permissions: new PermissionsBitField(),
          voice: {
            channel: {
              members: new Map([['', movedMember]]),
            },
            setChannel: jest.fn(),
          },
        },
      }
      const channel = 'A new channel'

      // Arrange
      const voiceService = new VoiceService(interaction)

      // Act
      const result = await voiceService.moveAll(channel)

      // Assert
      expect(movedMember.voice.setChannel).not.toHaveBeenCalled()
      expect(typeof result).toBe('string')
    })

    it('member is not in a voice channel', async () => {
      const interaction: IVoiceInteraction = {
        member: {
          permissions: new PermissionsBitField().add('MoveMembers'),
          voice: {
            channel: null,
            setChannel: jest.fn(),
          },
        },
      }

      // Arrange
      const voiceService = new VoiceService(interaction)

      // Act
      const result = await voiceService.moveAll('A new channel')

      // Assert
      expect(typeof result).toBe('string')
    })

    it('member is null', async () => {
      const interaction: IVoiceInteraction = { member: null }
      const channel = 'A really cool channel'

      // Arrange
      const voiceService = new VoiceService(interaction)

      // Act
      const result = await voiceService.moveAll(channel)

      // Assert
      expect(typeof result).toBe('string')
    })
  })
})
