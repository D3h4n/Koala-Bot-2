export default interface IVoiceService {
  moveAll: (channel: string) => Promise<string | null>
}
