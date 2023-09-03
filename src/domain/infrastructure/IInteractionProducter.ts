import { ChatInputCommandInteraction } from 'discord.js'
import ILogger from '@domain/ILogger'

export default interface IInteractionProducer {
  registerCommandHandler: (
    handler: (interaction: ChatInputCommandInteraction) => void,
    logger?: ILogger
  ) => void
}
