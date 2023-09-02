import { ILogger } from '../domain/infrastructure/ILogger'

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
