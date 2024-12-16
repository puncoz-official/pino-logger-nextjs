import type { ServerLoggerConfig } from "#/LoggerConfig"

import type pino from "pino"
import { clientLogger } from "./client.logger"
import { serverLogger } from "./server.logger"

export default (options: ServerLoggerConfig): pino.Logger => {
  return typeof window === "undefined" ? serverLogger(options) : clientLogger()
}
