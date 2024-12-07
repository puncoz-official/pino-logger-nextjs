import pino from "pino"

export const serverLogger = (defaultConfig = {}): pino.Logger => {
  return pino({
    ...defaultConfig,
    timestamp: false,
    formatters: {
      level: (label) => {
        return { level: label }
      },

      log: (object) => {
        if ("err" in object) {
          const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err

          const isSerializedError = (error: unknown): error is pino.SerializedError => {
            if (typeof error === "object" && error !== null) {
              return "stack" in error && "type" in error && "message" in error
            }
            return false
          }

          if (isSerializedError(err)) {
            object.stack_trace = err.stack
            object.type = err.type
            object.message = err.message
          }
          delete object.err
        }

        return object
      },
    },
  })
}
