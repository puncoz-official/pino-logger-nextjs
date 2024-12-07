import pino from "pino"

import { getLoggerConfig } from "@/config"
import { formatClientLogMessage } from "@/utils"

export const clientLogger = (): pino.Logger => {
  return pino({
    browser: {
      transmit: {
        level: "info",
        send: (level, logEvent) => {
          const logConfig = getLoggerConfig()

          // call the logger with the event
          logConfig.events.onLog(logEvent)

          if (logConfig.logApi === undefined) {
            return
          }

          const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Content-Type": "application/json",
            type: "application/json",
          }

          const blob = new Blob([JSON.stringify({ payload: formatClientLogMessage(logEvent), level })], headers)
          navigator.sendBeacon(logConfig.logApi, blob)
        },
      },
    },
  })
}
