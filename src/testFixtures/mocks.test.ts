import IDistubeClient from '@domain/IDistubeClient'
import IMessageService from '@domain/IMessageService'
import IMusicService from '@domain/IMusicService'
import IVoiceService from '@domain/IVoiceService'

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
  getNowPlaying: jest.fn(),
  seek: jest.fn(),
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
  getNowPlaying: jest.fn(),
  seek: jest.fn(),
})
