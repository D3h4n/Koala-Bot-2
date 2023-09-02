import EmbeddedMessage from '../../embeds/embeddedMessage'

export default interface IMessageService {
  reply: (message: string | EmbeddedMessage) => Promise<void>
  defer: () => Promise<void>
  noReply: () => Promise<void>
}
