import IDistubeClient from '../src/domain/infrastructure/IDistubeClient'
import IMessageService from '../src/domain/services/IMessageService'
import IMusicService from '../src/domain/services/IMusicService'
import IVoiceService from '../src/domain/services/IVoiceService'

export const mockMusicService: () => IMusicService = () => ({
  play: jest.fn(),
  tryPause: jest.fn(),
  tryResume: jest.fn(),
  getQueue: jest.fn(),
  tryShuffle: jest.fn(),
  trySkip: jest.fn(),
  tryStop: jest.fn(),
  remove: jest.fn(),
  loop: jest.fn(),
})

export const mockMessageService: () => IMessageService = () => ({
  reply: jest.fn(),
  defer: jest.fn(),
  noReply: jest.fn(),
})

export const mockVoiceService: () => IVoiceService = () => ({
  moveAll: jest.fn(),
})

export const mockDistubeClient: () => IDistubeClient = () => ({
  registerEventHandlers: jest.fn(),
  play: jest.fn(),
  tryPause: jest.fn(),
  tryResume: jest.fn(),
  getQueue: jest.fn(),
  tryShuffle: jest.fn(),
  trySkip: jest.fn(),
  tryStop: jest.fn(),
  remove: jest.fn(),
  loop: jest.fn(),
})
