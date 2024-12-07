import { logLevels } from "@/config"
import { logger } from "@/logger"

import type { LoggerApiRouteBody } from "#/LoggerApiRoute"

export const POST = async (request: Request): Promise<Response> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body: LoggerApiRouteBody = await request.json()
  const {
    payload: { ts, messages, bindings },
    level,
  } = body

  // check if label is valid
  if (!(level in logLevels)) {
    return Response.json({ status: "error", message: `Invalid log level: ${level}` }, { status: 400 })
  }

  logger
    .child({
      ...bindings,
      x_timestamp: ts,
      x_isFrontend: true,
      x_userAgent: request.headers.get("user-agent"),
      x_request_id: request.headers.get("x-request-id") ?? "not-set",
    })
    [level](Array.from(messages))

  return Response.json({ status: "ok" })
}
