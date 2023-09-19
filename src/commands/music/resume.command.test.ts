import { mockMessageService, mockMusicService, mockVoiceService } from 'src/testFixtures/mocks.test'
import ServiceProvider from '@services/serviceProvider'
import ResumeCommand from './resume.command'
import { err, ok } from '@domain/monads/Result'

describe('The resume command', () => {
  it('resumes the currently playing song', async () => {
    const successMessage = 'Resuming song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )
    serviceProvider.music.tryResume = jest.fn(async () => ok(successMessage))

    // Arrange
    const resume = new ResumeCommand()

    // Act
    await resume.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryResume).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(successMessage)
  })

  it('replies with a message if pausing fails', async () => {
    const errorMessage = 'Failed to resume song'
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.tryResume = jest.fn(async () => err(errorMessage))

    // Arrange
    const resume = new ResumeCommand()

    // Act
    await resume.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryResume).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalledWith(errorMessage)
  })
})
