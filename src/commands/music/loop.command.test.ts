import LoopCommand from './loop.command'
import { err, ok } from '@domain/monads/Result'
import ServiceProvider from '@services/serviceProvider'
import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'

describe('The Loop Command', () => {
  describe('can try to loop a song', () => {
    it('and reply with a success message', async () => {
      const successMessage = 'A song name is looping'

      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => ok(successMessage))

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, new Map([['song', 'song']]))

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('song')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
    })

    it('and reply with an error message', async () => {
      const errorMessage = 'Failed to loop song'
      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => err(errorMessage))

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, new Map([['song', 'song']]))

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('song')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
    })
  })

  describe('can try to loop a queue', () => {
    it('and reply with a success message', async () => {
      const successMessage = 'A queue is looping'

      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => ok(successMessage))

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, new Map([['queue', 'queue']]))

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('queue')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
    })

    it('and reply with an error message', async () => {
      const errorMessage = 'Failed to loop queue'

      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => err(errorMessage))

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, new Map([['queue', 'queue']]))

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('queue')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
    })
  })

  describe('can try to stop looping the queue', () => {
    it('and reply with a success message', async () => {
      const successMessage = 'stopped looping the queue'

      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => ok(successMessage))

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, new Map([['off', 'off']]))

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('off')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
    })

    it('and reply with an error message', async () => {
      const errorMessage = 'Failed to stop looping'

      const serviceProvider = new ServiceProvider(
        mockMessageService(),
        mockMusicService(),
        mockVoiceService()
      )
      serviceProvider.music.loop = jest.fn(async () => err(errorMessage))

      // Arrange
      const loopCommand = new LoopCommand()

      // Act
      await loopCommand.run(serviceProvider, new Map([['off', 'off']]))

      // Assert
      expect(serviceProvider.music.loop).toHaveBeenCalledWith('off')
      expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
    })
  })
})
