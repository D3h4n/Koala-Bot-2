import { mockMessageService, mockMusicService, mockVoiceService } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import ResumeCommand from '../../src/commands/resumeCommand'

describe('The resume command', () => {
  it('resumes the currently playing song', async () => {
    const resume = new ResumeCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.tryResume = jest.fn(async () => true)

    await resume.run(serviceProvider)
    expect(serviceProvider.music.tryResume).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const resume = new ResumeCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageService(),
      mockMusicService(),
      mockVoiceService()
    )

    serviceProvider.music.tryResume = jest.fn(async () => false)

    // Act
    await resume.run(serviceProvider)

    // Assert
    expect(serviceProvider.music.tryResume).toHaveBeenCalled()
    expect(serviceProvider.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>serviceProvider.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
