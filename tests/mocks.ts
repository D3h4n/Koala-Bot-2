import { IMessageAdapter } from '../src/adapters/messageAdapter'
import { IMusicAdapter } from '../src/adapters/musicAdapter'
import { IVoiceAdapter } from '../src/adapters/voiceAdapter'

export const musicAdapter: () => IMusicAdapter = () => ({
  play: jest.fn(),
  stop: jest.fn(),
  getQueue: jest.fn(),
  shuffle: jest.fn(),
  skip: jest.fn(),
  remove: jest.fn(),
  tryPause: jest.fn(),
  tryResume: jest.fn(),
})

export const messageAdapter: () => IMessageAdapter = () => ({
  reply: jest.fn(),
  defer: jest.fn(),
  noReply: jest.fn(),
})

export const voiceAdapter: () => IVoiceAdapter = () => ({
  moveAll: jest.fn(),
})
