import type pino from "pino"

interface CustomError {
  type: string
  stack: string
  message: string
}

interface Payload extends pino.LogEvent {
  messages: {
    err: CustomError
  }[]
}

export interface LoggerApiRouteBody {
  level: pino.Level
  payload: Payload
}
