import pretty, { type PinoPretty } from "pino-pretty"

import { stringify } from "@/utils"

const getPrettyStream = (options: PinoPretty.PrettyOptions): PinoPretty.PrettyStream => {
  return pretty({
    ...options,
    colorize: true,
    translateTime: "SYS:standard",
    // ignore: 'pid,hostname',
    // levelFirst: true,
    // messageKey: 'msg',
    // timestampKey: 'time',
    // levelKey: 'level',

    // messageFormat: (log, messageKey, levelLabel, { colors }) => {
    //   // `colors` is a Colorette object with colors enabled based on `colorize` option.
    //   const req = log['req'];
    //   const reqUrl = req instanceof Request ? req.url : null;

    //   return `This is a ${colors.red('colorized')}, custom message: ${log[messageKey]}, ${levelLabel} ${log['pid'] ? ` - ${log['pid']}` : ''} - ${reqUrl ? ` - url: ${reqUrl}` : ''}${log[''] ? ` - ${log['pid']}` : ''}`;
    // },

    customPrettifiers: {
      // The argument for this function will be the same
      // string that's at the start of the log-line by default:
      timestamp: (timestamp) => `🕰 ${stringify(timestamp)}`,

      // The argument for the level-prettifier may vary depending
      // on if the levelKey option is used or not.
      // By default this will be the same numerics as the Pino default:
      // level: (logLevel) => `LEVEL: ${logLevel}`,

      // level provides additional data in `extras`:
      // * label => derived level label string
      // * labelColorized => derived level label string with colorette colors applied based on customColors and whether colors are supported
      // level: (logLevel, key, log, { label, labelColorized, colors }) =>
      //   `LEVEL: ${logLevel} LABEL: ${label} COLORIZED LABEL: ${labelColorized}`,

      hostname: (hostname) => `MY HOST: ${stringify(hostname)}`,

      pid: (pid) => (typeof pid === "string" ? pid : JSON.stringify(pid)),

      name: (name, _, __, { colors }) => colors.blue(stringify(name)),

      caller: (caller, _, __, { colors }) => colors.greenBright(stringify(caller)),

      myCustomLogProp: (value, _, __, { colors }) => `My Prop -> ${colors.bold(stringify(value))} <--`,
    },
  })
}

export default getPrettyStream
