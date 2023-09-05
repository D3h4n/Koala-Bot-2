export default interface ILogger {
  debug: (msg: string) => void
  info: (msg: string) => void
  warn: (warn: Error | string) => void
  error: (error: Error | string) => void
}
