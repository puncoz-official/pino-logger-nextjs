import pino, { type BaseLogger, type LogEvent } from "pino"

export type LogLevel = "error" | "debug" | "fatal" | "info" | "trace" | "silent" | "warn"

export interface ServerLoggerConfig {
  logPath?: string
  logLevel?: LogLevel
  stdout?: boolean

  pino?: {
    options?: pino.LoggerOptions
    transportTargets?: pino.TransportTargetOptions[]
  }
}

export interface LoggerConfig {
  logPath?: string
  logApi?: string

  events: {
    onLog: (event: LogEvent) => void
  }
}

export type LogLevels = Exclude<keyof BaseLogger, "string" | "level">
