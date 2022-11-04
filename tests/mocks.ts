import { Option } from '../src/commands/common'
import { CommandInfo } from '../src/adapters/commandAdapter'

export function mockCommandInfo(name = '', options: Map<string, Option> = new Map()): CommandInfo {
  return {
    name,
    options,
    music: {
      play: jest.fn(),
      stop: jest.fn(),
      queue: jest.fn(),
      shuffle: jest.fn(),
      skip: jest.fn(),
    },
    message: {
      reply: jest.fn(),
      replyWithEmbeddedMessage: jest.fn(),
      noReply: jest.fn(),
    },
  }
}