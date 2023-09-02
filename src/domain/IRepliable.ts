import { EmbedBuilder } from 'discord.js'

export type ReplyMessage = string | { embeds: EmbedBuilder[] }

export default interface IRepliable {
  replied: boolean
  deferred: boolean
  editReply: (message: ReplyMessage) => Promise<unknown>
  reply: (message: ReplyMessage) => Promise<unknown>
  deferReply: () => Promise<unknown>
  deleteReply: () => Promise<unknown>
}
