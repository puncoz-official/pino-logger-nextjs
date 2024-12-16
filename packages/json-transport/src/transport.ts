import fs from "node:fs"
import path from "node:path"
import type { Transform } from "node:stream"

import build from "pino-abstract-transport"

export interface LogData {
  level?: string
  levelNumber?: number
  time?: number;
  message?: string

  [key: string]: unknown;
}

export interface LogObject {
  level: number
  time: number
  msg?: string
  message?: string

  [key: string]: unknown
}

export interface SourceTransform {
  levels: {
    labels: Record<number, string>
    values: Record<string, number>
  }
  messageKey: string
  errorKey: string
}

export interface IJsonTransportOptions {
  logPath?: string
}

export function jsonTransport(options: IJsonTransportOptions) {
  const buildFunc = async (source: SourceTransform & Transform & build.OnUnknown) => {
    for await (const obj of source as AsyncIterable<LogObject>) {
      // logging logData data
      const logData: LogData = {}

      logData.level = source.levels.labels[obj.level].toUpperCase()
      logData.levelNumber = obj.level
      logData.time = obj.time

      // get the message
      // Note: pino passes message as obj.msg but if user passes object to pino it will pass it to us
      // even without msg field. later we map msg -> message so let's also read message field.
      logData.message = obj.msg ?? obj.message

      // prevent overriding message with msg
      if (obj.msg !== undefined && obj.message !== undefined) {
        logData.custom_message = obj.message
      }

      // carry over any additional data fields
      Object.keys(obj)
        .filter(key => !["level", "time", "msg", "message", "v"].includes(key))
        .forEach(key => logData[key] = obj[key])

      // Ensure the logs directory exists
      const logPath = options.logPath ?? "./logs/app.json"
      const logDir = path.dirname(logPath)
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      // write logData to file
      const logString = JSON.stringify(logData) + "\n"
      fs.appendFile(logPath, logString, { flag: "a" }, (err) => {
        if (err) {
          console.error("Failed to write logData to file", err)
        }
      })
    }
  }

  const closeFunc = () => {
    // console.info("Closing json transport")
  }

  // @ts-expect-error build function doesn't return anything
  return build(buildFunc, {
    close: closeFunc,
    expectPinoConfig: true,
  })
}
