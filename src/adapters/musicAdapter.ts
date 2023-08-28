import DisTube, { Queue } from 'distube'
import { ChatInputCommandInteraction, GuildMember, TextChannel } from 'discord.js'
import EmbeddedMessage from '../embeds/embeddedMessage'
import { IDistubeClient } from '../services/distubeClient'
import QueueMessage from '../embeds/queueMessage'

export interface IMusicAdapter {
  play: (query: string) => Promise<string | null>
  tryPause: () => Promise<boolean>
  tryResume: () => Promise<boolean>
  getQueue: (page?: number) => EmbeddedMessage
  shuffle: () => Promise<void>
  skip: () => Promise<void>
  stop: () => Promise<void>
  remove: (position: number) => Promise<string | null>
}

export default class MusicAdapter implements IMusicAdapter {
  private readonly distube: DisTube
  private readonly member?: GuildMember
  private readonly channel?: TextChannel
  private readonly songQueue?: Queue

  constructor(interaction: ChatInputCommandInteraction, distubeClient: IDistubeClient) {
    this.distube = distubeClient.client
    this.member = (interaction.member as GuildMember | null) ?? undefined
    this.channel = (interaction.channel as TextChannel | null) ?? undefined
    this.songQueue = this.distube.getQueue(interaction)
  }

  async play(query: string): Promise<string | null> {
    const member = this.member
    const voiceChannel = member?.voice.channel

    if (!voiceChannel) return 'Member not in voice channel'

    await this.distube.play(voiceChannel, query, {
      member,
      textChannel: this.channel,
    })
    return null
  }

  async tryPause(): Promise<boolean> {
    if (!this.songQueue?.playing) return false
    this.songQueue.pause()
    return true
  }

  async tryResume(): Promise<boolean> {
    if (!this.songQueue?.paused) return false
    this.songQueue.resume()
    return true
  }

  getQueue(page: number = 1): EmbeddedMessage {
    return this.songQueue ? new QueueMessage(this.songQueue, page) : QueueMessage.EmptyQueue
  }

  async shuffle(): Promise<void> {
    await this.songQueue?.shuffle()
  }

  async skip(): Promise<void> {
    if (this.songQueue && this.songQueue.songs.length > 1) {
      await this.songQueue.skip()
    } else {
      await this.stop()
    }
  }

  async stop(): Promise<void> {
    await this.songQueue?.stop()
  }

  async remove(position: number): Promise<string | null> {
    if (this.songQueue && this.songQueue.songs.length > position) {
      const [song] = this.songQueue.songs.splice(position, 1)
      return song.name || 'Unnamed Song'
    }

    return null
  }
}
