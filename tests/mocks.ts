import { IMessageAdapter } from '../src/adapters/messageAdapter'
import { IMusicAdapter } from '../src/adapters/musicAdapter'
import { IVoiceAdapter } from '../src/adapters/voiceAdapter'
import { IDistubeClient } from '../src/services/distubeClient'

export const mockMusicAdapter: () => IMusicAdapter = () => ({
  play: jest.fn(),
  tryPause: jest.fn(),
  tryResume: jest.fn(),
  getQueue: jest.fn(),
  tryShuffle: jest.fn(),
  trySkip: jest.fn(),
  tryStop: jest.fn(),
  remove: jest.fn(),
})

export const mockMessageAdapter: () => IMessageAdapter = () => ({
  reply: jest.fn(),
  defer: jest.fn(),
  noReply: jest.fn(),
})

export const mockVoiceAdapter: () => IVoiceAdapter = () => ({
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
