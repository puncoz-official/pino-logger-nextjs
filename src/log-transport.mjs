import build from "pino-abstract-transport"

export default function(opts) {
    return build(async (source) => {
        for await (const record of source) {
            console.log({ record })
        }
    })
}
