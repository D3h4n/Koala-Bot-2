import LoopCommand from '../../src/commands/loopCommand'
import ServiceProvider from '../../src/services/serviceProvider'
import { mockMessageService, mockMusicService, mockVoiceService } from '../mocks'

describe('The Loop Command', () => {
  describe('can try to loop a song', () => {
    it('and reply with a success message', async () => {
      const options = new Map([['song', 'song']])
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      const successfulResult = 'A song name is looping'
      serviceProvider.music.loop = jest.fn(async () => successfulResult)

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, options)

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('song')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(successfulResult)
    })

    it('and reply with an error message', async () => {
      const options = new Map([['song', 'song']])
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => null)

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, options)

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('song')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith('Failed to loop song')
    })
  })

  describe('can try to loop a queue', () => {
    it('and reply with a success message', async () => {
      const options = new Map([['queue', 'queue']])
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      const successfulResult = 'A queue is looping'
      serviceProvider.music.loop = jest.fn(async () => successfulResult)

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, options)

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('queue')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(successfulResult)
    })

    it('and reply with an error message', async () => {
      const options = new Map([['queue', 'queue']])
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => null)

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, options)

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('queue')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith('Failed to loop queue')
    })
  })

  describe('can try to stop looping the queue', () => {
    it('and reply with a success message', async () => {
      const options = new Map([['off', 'off']])
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      const successfulResult = 'stopped looping the queue'
      serviceProvider.music.loop = jest.fn(async () => successfulResult)

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, options)

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('off')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(successfulResult)
    })

    it('and reply with an error message', async () => {
      const options = new Map([['off', 'off']])
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => null)

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, options)

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('off')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith('Failed to stop looping')
    })
  })
})
