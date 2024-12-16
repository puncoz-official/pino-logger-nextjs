import type { LoggerConfig, LogLevels } from "#/LoggerConfig"
import type { LogEvent } from "pino"

let logConfig: LoggerConfig = {
  events: {
    onLog: (event: LogEvent) => {
      console.log(event)
    },
  },
}

export const logLevels: Record<LogLevels, LogLevels> = {
  error: "error",
  debug: "debug",
  fatal: "fatal",
  info: "info",
  trace: "trace",
  silent: "silent",
  warn: "warn",
} as const

export const initLogger = (config: LoggerConfig): void => {
  logConfig = { ...logConfig, ...config }
}

export const getLoggerConfig = (): LoggerConfig => logConfig
