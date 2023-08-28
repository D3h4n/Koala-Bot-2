export interface ILogger {
  info: (msg: string) => void
  error: (error: Error | string) => void
  warn: (warn: Error | string) => void
}

export default class MyLogger implements ILogger {
  info(msg: string) {
    console.log('[INFO] ' + msg)
  }

  error(error: string | Error) {
    if (typeof error === 'string') {
      return console.error('[ERROR] ' + error)
    }

    console.error(error)
  }

  warn(warn: string | Error) {
    if (warn instanceof Error) {
      warn = warn.message
    }

    console.log('[WARN] ' + warn)
  }
}
