import { mockMessageAdapter, mockMusicAdapter, mockVoiceAdapter } from '../mocks'

import ServiceProvider from '../../src/services/serviceProvider'
import ResumeCommand from '../../src/commands/resumeCommand'

describe('The resume command', () => {
  it('resumes the currently playing song', async () => {
    const resume = new ResumeCommand()
    const serviceProvider = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    serviceProvider.music.tryResume = jest.fn(async () => true)

    await resume.run(serviceProvider)
    expect(serviceProvider.music.tryResume).toHaveBeenCalled()
    expect(serviceProvider.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const resume = new ResumeCommand()
    const commandInfo = new ServiceProvider(
      mockMessageAdapter(),
      mockMusicAdapter(),
      mockVoiceAdapter()
    )

    commandInfo.music.tryResume = jest.fn(async () => false)

    // Act
    await resume.run(commandInfo)

    // Assert
    expect(commandInfo.music.tryResume).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
