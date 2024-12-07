import type pino from "pino"

export const formatClientLogMessage = (logEvent: pino.LogEvent): pino.LogEvent => {
  logEvent.messages = logEvent.messages.map((message) => {
    if (typeof message !== "object" || !("stack" in message)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return message
    }

    return {
      err: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        type: message.type,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        stack: message.stack,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        message: message.msg ?? message.message,
      },
    }
  })

  return logEvent
}
