import { clientLogger } from "./client.logger"
import { serverLogger } from "./server.logger"

import type pino from "pino"

export default (): pino.Logger => {
  console.log("hello from logger index")
  return typeof window === "undefined" ? serverLogger() : clientLogger()
}
