import { clientLogger } from "./client.logger"
import { serverLogger } from "./server.logger"

import type pino from "pino"

export const logger = typeof window === "undefined" ? serverLogger() : clientLogger()

export const childLogger = (requestId: string): pino.Logger => {
  return logger.child({ x_request_id: requestId })
}
