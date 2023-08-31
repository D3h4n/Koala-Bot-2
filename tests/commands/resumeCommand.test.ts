import CommandAdapter from '../../src/adapters/commandAdapter'
import ResumeCommand from '../../src/commands/resumeCommand'
import { messageAdapter, musicAdapter, voiceAdapter } from '../mocks'

describe('The resume command', () => {
  it('resumes the currently playing song', async () => {
    const resume = new ResumeCommand()
    const commandAdapter = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

    commandAdapter.music.tryResume = jest.fn(async () => true)

    await resume.run(new Map(), commandAdapter)
    expect(commandAdapter.music.tryResume).toHaveBeenCalled()
    expect(commandAdapter.message.noReply).toHaveBeenCalled()
  })

  it('replies with a message if pausing fails', async () => {
    // Arrange
    const resume = new ResumeCommand()
    const commandInfo = new CommandAdapter(messageAdapter(), musicAdapter(), voiceAdapter())

    commandInfo.music.tryResume = jest.fn(async () => false)

    // Act
    await resume.run(new Map(), commandInfo)

    // Assert
    expect(commandInfo.music.tryResume).toHaveBeenCalled()
    expect(commandInfo.message.reply).toHaveBeenCalled()
    expect(typeof (<jest.Mock>commandInfo.message.reply).mock.lastCall?.[0]).toBe('string')
  })
})
