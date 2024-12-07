import type { BaseLogger, LogEvent } from "pino"

export interface LoggerConfig {
  logPath?: string
  logApi?: string

  events: {
    onLog: (event: LogEvent) => void
  }
}

export type LogLevels = Exclude<keyof BaseLogger, "string" | "level">
