import { ChatInputCommandInteraction } from 'discord.js'
import MessageAdapter from './MessageAdapter'
import MusicAdapter from './MusicAdapter'
import DisTube from 'distube'
import { MessageReplier, MusicPlayer } from '../interactions'

export default class Adapter {
  messageReplier: MessageReplier
  musicPlayer: MusicPlayer

  constructor(interaction: ChatInputCommandInteraction, distube: DisTube) {
    this.messageReplier = new MessageAdapter(interaction)
    this.musicPlayer = new MusicAdapter(distube, interaction)
  }
}
