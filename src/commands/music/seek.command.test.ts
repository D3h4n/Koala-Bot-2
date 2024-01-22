import ServiceProvider from '@services/serviceProvider'
import SeekCommand from './seek.command'
import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import { err, ok } from '@domain/monads/Result'

describe('The seek command', () => {
  it.each(['2:30', '30:30:30', '05:01', '5', '05'])(
    'correctly seeks the timestamp',
    async (timestamp) => {
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )

      serviceProvider.music.seek = jest.fn(async (timestamp) =>
        ok(`Skipped to timestamp: ${timestamp}`)
      )

      // Arrange
      const seekCommand = new SeekCommand()

      // Act
      await seekCommand.run(serviceProvider, new Map([['timestamp', timestamp]]))

      // Assert
      expect(serviceProvider.music.seek).toHaveBeenCalledWith(timestamp)
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(
        `Skipped to timestamp: ${timestamp}`
      )
    }
  )

  it('correct sends error message', async () => {
    const errorTimestamp = 'jasdfasdf'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.seek = jest.fn(async () => err('Error skipping to that timestamp'))

    // Arrange
    const seekCommand = new SeekCommand()

    // Act
    await seekCommand.run(serviceProvider, new Map([['timestamp', errorTimestamp]]))

    // Assert
    expect(serviceProvider.music.seek).toHaveBeenCalledWith(errorTimestamp)
    expect(serviceProvider.message.reply).toHaveBeenCalledWith('Error skipping to that timestamp')
  })
})
