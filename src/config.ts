import type { LoggerConfig } from "#/LoggerConfig"

let logConfig: LoggerConfig = {}
export const initLogger = (config: LoggerConfig): void => {
  logConfig = { ...logConfig, ...config }
}

export const getLoggerConfig = (): LoggerConfig => logConfig
