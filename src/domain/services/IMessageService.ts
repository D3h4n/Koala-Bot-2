import { EmbedBuilder } from 'discord.js'
import EmbeddedMessage from '../../embeds/embeddedMessage'

export type ReplyMessage = string | { embeds: EmbedBuilder[] }

export interface IRepliable {
  replied: boolean
  deferred: boolean
  editReply: (message: ReplyMessage) => Promise<unknown>
  reply: (message: ReplyMessage) => Promise<unknown>
  deferReply: () => Promise<unknown>
  deleteReply: () => Promise<unknown>
}

export interface IMessageService {
  reply: (message: string | EmbeddedMessage) => Promise<void>
  defer: () => Promise<void>
  noReply: () => Promise<void>
}
