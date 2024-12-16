import type { Transform } from "node:stream";
import build from "pino-abstract-transport";
export interface LogData {
    level?: string;
    levelNumber?: number;
    time?: number;
    message?: string;
    [key: string]: unknown;
}
export interface LogObject {
    level: number;
    time: number;
    msg?: string;
    message?: string;
    [key: string]: unknown;
}
export interface SourceTransform {
    levels: {
        labels: Record<number, string>;
        values: Record<string, number>;
    };
    messageKey: string;
    errorKey: string;
}
export interface IJsonTransportOptions {
    logPath?: string;
}
export declare function jsonTransport(options: IJsonTransportOptions): Promise<Transform & build.OnUnknown> & Transform & build.OnUnknown & Promise<Transform>;
