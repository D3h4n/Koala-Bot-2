import IMessageService from './IMessageService'
import IMusicService from './IMusicService'
import IVoiceService from './IVoiceService'

export default interface IServiceProvider {
  message: IMessageService
  music: IMusicService
  voice: IVoiceService
}
