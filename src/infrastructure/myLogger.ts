import ILogger from '@domain/ILogger'

export enum LogLevel {
  DEBUG = 0,
  INFO,
  WARN,
  ERROR,
  DISABLED,
}

export default class MyLogger implements ILogger {
  private readonly logLevel: LogLevel

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel
  }

  debug(msg: string) {
    if (this.logLevel > LogLevel.DEBUG) return

    console.log('[DEBUG] ' + msg)
  }

  info(msg: string) {
    if (this.logLevel > LogLevel.INFO) return
    console.log('[INFO] ' + msg)
  }

  warn(warn: string | Error) {
    if (this.logLevel > LogLevel.WARN) return
    if (warn instanceof Error) {
      warn = warn.message
    }
    console.log('[WARN] ' + warn)
  }

  error(error: string | Error) {
    if (this.logLevel > LogLevel.ERROR) return
    if (typeof error === 'string') {
      return console.error('[ERROR] ' + error)
    }

    console.error(error)
  }
}
