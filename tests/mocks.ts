import { CommandInfo, Option } from '../src/adapters/commandAdapter'
import { EmbeddedMessage } from '../src/adapters/messageAdapter'

export function mockCommandInfo(name = '', options: Map<string, Option> = new Map()): CommandInfo {
  return {
    name,
    options,
    music: {
      play: jest.fn(),
      stop: jest.fn(),
      queue: jest.fn(() => new EmbeddedMessage({})),
      shuffle: jest.fn(),
      skip: jest.fn(),
      remove: jest.fn(),
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
