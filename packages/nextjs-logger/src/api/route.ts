import type { LoggerApiRouteBody } from "#/LoggerApiRoute"
import { logLevels } from "@/config"
import pino from "pino"

export const loggerRoute = async (request: Request, logger: pino.Logger): Promise<Response> => {
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

  const forwardedIp = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  logger
    .child({
      ...bindings,
      module: "browser",
      headers: request.headers,
      client_timestamp: ts,
      client_ip: forwardedIp ? forwardedIp.split(/, /)[0] : realIp ?? "Unknown",
      client_userAgent: request.headers.get("user-agent"),
      client_request_id: request.headers.get("x-request-id") ?? "not-set",
    })
    [level](...[messages])

  return Response.json({ status: "ok" })
}
