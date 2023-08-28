import { ICommandAdapter, Option } from '../src/adapters/commandAdapter'

export function mockCommandAdapter(
  name = '',
  options: Map<string, Option> = new Map()
): ICommandAdapter {
  return {
    name,
    options,
    music: {
      play: jest.fn(),
      stop: jest.fn(),
      queue: jest.fn(),
      shuffle: jest.fn(),
      skip: jest.fn(),
      remove: jest.fn(),
      tryPause: jest.fn(),
      tryResume: jest.fn(),
    },
    message: {
      reply: jest.fn(),
      defer: jest.fn(),
      noReply: jest.fn(),
    },
    voice: {
      moveAll: jest.fn(),
    },
  }
}
