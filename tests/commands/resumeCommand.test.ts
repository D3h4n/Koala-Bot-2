import ResumeCommand from '../../src/commands/resumeCommand'
import { mockCommandInfo } from '../mocks'

describe('The resume command', () => {
  it('resumes the currently playing song', async () => {
    const resume = new ResumeCommand()
    const commandInfo = mockCommandInfo()

    commandInfo.music.tryResume = jest.fn(async () => true)

    await resume.run(commandInfo)
    expect(commandInfo.music.tryResume).toHaveBeenCalled()
    expect(commandInfo.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const resume = new ResumeCommand()
    const commandInfo = mockCommandInfo()

    commandInfo.music.tryResume = jest.fn(async () => false)

    // Act
    await resume.run(commandInfo)

    // Assert
    expect(commandInfo.music.tryResume).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
