export interface ILogger {
  info: (msg: string) => void
  error: (error: Error | string) => void
  warn: (warn: Error | string) => void
}
