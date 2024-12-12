import { logLevels } from "@/config"
import { serverLogger } from "@/logger/server.logger"

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

  serverLogger()
    .child({
      ...bindings,
      module: "browser",
      is_client_side: true,
      x_timestamp: ts,
      x_userAgent: request.headers.get("user-agent"),
      x_request_id: request.headers.get("x-request-id") ?? "not-set",
    })
    [level](...[messages])

  return Response.json({ status: "ok" })
}
