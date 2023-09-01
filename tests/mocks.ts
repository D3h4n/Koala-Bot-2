import { IMessageService } from '../src/services/messageService'
import { IMusicService } from '../src/services/musicService'
import { IVoiceService } from '../src/services/voiceService'
import { IDistubeClient } from '../src/infrastructure/distubeClient'

export const mockMusicAdapter: () => IMusicService = () => ({
  play: jest.fn(),
  tryPause: jest.fn(),
  tryResume: jest.fn(),
  getQueue: jest.fn(),
  tryShuffle: jest.fn(),
  trySkip: jest.fn(),
  tryStop: jest.fn(),
  remove: jest.fn(),
})

export const mockMessageAdapter: () => IMessageService = () => ({
  reply: jest.fn(),
  defer: jest.fn(),
  noReply: jest.fn(),
})

export const mockVoiceAdapter: () => IVoiceService = () => ({
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
})
