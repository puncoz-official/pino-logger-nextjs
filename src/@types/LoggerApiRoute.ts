import type pino from "pino"

interface Payload extends pino.LogEvent {
  messages: {
    err: {
      type: string
      stack: string
      message: string
    }
  }[]
}

export interface LoggerApiRouteBody {
  level: pino.Level
  payload: Payload
}
