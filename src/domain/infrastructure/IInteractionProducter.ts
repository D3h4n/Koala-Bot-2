import { ChatInputCommandInteraction } from 'discord.js'

export type InteractionHandler = (interaction: ChatInputCommandInteraction) => Promise<void> | void

export default interface IInteractionProducer {
  subscribe: (handler: InteractionHandler) => void
}
