import pino from "pino"

export const serverLogger = (defaultConfig = {}): pino.Logger => {
  return pino(
    {
      ...defaultConfig,
      timestamp: true,
      level: "trace",
      transport: {
        target: "./log-transport.mjs",
        // targets: [
        //   {
        //     target: "pino-pretty",
        //     options: {
        //       colorize: true,
        //       translateTime: "SYS:standard",
        //       // destination: "./logs/app.json",
        //       // ignore: 'pid,hostname',
        //       // levelFirst: true,
        //       // messageKey: 'msg',
        //       // timestampKey: 'time',
        //       // levelKey: 'level',
        //
        //       // messageFormat: (log, messageKey, levelLabel, { colors }) => {
        //       //   // `colors` is a Colorette object with colors enabled based on `colorize` option.
        //       //   const req = log['req'];
        //       //   const reqUrl = req instanceof Request ? req.url : null;
        //
        //       //   return `This is a ${colors.red('colorized')}, custom message: ${log[messageKey]}, ${levelLabel} ${log['pid'] ? ` - ${log['pid']}` : ''} - ${reqUrl ? ` - url: ${reqUrl}` : ''}${log[''] ? ` - ${log['pid']}` : ''}`;
        //       // },
        //
        //       // customPrettifiers: {
        //       //   // The argument for this function will be the same
        //       //   // string that's at the start of the log-line by default:
        //       //   timestamp: (timestamp) => `🕰 ${stringify(timestamp)}`,
        //       //
        //       //   // The argument for the level-prettifier may vary depending
        //       //   // on if the levelKey option is used or not.
        //       //   // By default this will be the same numerics as the Pino default:
        //       //   // level: (logLevel) => `LEVEL: ${logLevel}`,
        //       //
        //       //   // level provides additional data in `extras`:
        //       //   // * label => derived level label string
        //       //   // * labelColorized => derived level label string with colorette colors applied based on customColors and whether colors are supported
        //       //   // level: (logLevel, key, log, { label, labelColorized, colors }) =>
        //       //   //   `LEVEL: ${logLevel} LABEL: ${label} COLORIZED LABEL: ${labelColorized}`,
        //       //
        //       //   hostname: (hostname) => `MY HOST: ${stringify(hostname)}`,
        //       //
        //       //   pid: (pid) => (typeof pid === "string" ? pid : JSON.stringify(pid)),
        //       //
        //       //   name: (name, _, __, { colors }) => colors.blue(stringify(name)),
        //       //
        //       //   caller: (caller, _, __, { colors }) => colors.greenBright(stringify(caller)),
        //       //
        //       //   myCustomLogProp: (value, _, __, { colors }) => `My Prop -> ${colors.bold(stringify(value))} <--`,
        //       // },
        //     } satisfies PinoPretty.PrettyOptions,
        //   },
        //   {
        //     target: "pino/file",
        //     options: {
        //       levelKey: "levelLabel",
        //       destination: "./logs/app.json",
        //       append: true,
        //       mkdir: true,
        //     },
        //     level: "warn",
        //   },
        // ],
        options: {
          colorize: true,
        },
      },
      // hooks: {
      //   logMethod(args, method, level) {
      //     // @ts-expect-error args[0] is object
      //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //     args[0] = { ...args[0], level: pino.levels.labels[level] }
      //     console.log({ args, level: pino.levels.labels[level] })
      //
      //     if (args.length === 2 && typeof args[0] !== "string") {
      //       // @ts-expect-error args is object
      //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //       args[0] = { ...args[0], level: pino.levels.labels[level] }
      //     }
      //
      //     method.apply(this, args)
      //   },
      // },
      formatters: {
        // level: (label, number) => {
        //   return { level: number, "level-label": label }
        // },

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
    },
    // pino.multistream([
    //   {
    //     stream: process.stdout,
    //   },
    //   {
    //     stream: pino.destination({
    //       dest: "./logs/app.json",
    //       append: true,
    //       mkdir: true,
    //       sync: true,
    //     }),
    //   },
    // ]),
  )
}
