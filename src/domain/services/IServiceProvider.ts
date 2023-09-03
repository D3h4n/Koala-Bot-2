import IMusicService from './IMusicService'
import IVoiceService from './IVoiceService'
import IMessageService from './IMessageService'

export default interface IServiceProvider {
  message: IMessageService
  music: IMusicService
  voice: IVoiceService
}
