"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonTransport = jsonTransport;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const pino_abstract_transport_1 = __importDefault(require("pino-abstract-transport"));
function jsonTransport(options) {
    const buildFunc = async (source) => {
        var _a, e_1, _b, _c;
        var _d, _e;
        try {
            for (var _f = true, _g = __asyncValues(source), _h; _h = await _g.next(), _a = _h.done, !_a; _f = true) {
                _c = _h.value;
                _f = false;
                const obj = _c;
                // logging logData data
                const logData = {};
                logData.level = source.levels.labels[obj.level].toUpperCase();
                logData.levelNumber = obj.level;
                logData.time = obj.time;
                // get the message
                // Note: pino passes message as obj.msg but if user passes object to pino it will pass it to us
                // even without msg field. later we map msg -> message so let's also read message field.
                logData.message = (_d = obj.msg) !== null && _d !== void 0 ? _d : obj.message;
                // prevent overriding message with msg
                if (obj.msg !== undefined && obj.message !== undefined) {
                    logData.custom_message = obj.message;
                }
                // carry over any additional data fields
                Object.keys(obj)
                    .filter(key => !["level", "time", "msg", "message", "v"].includes(key))
                    .forEach(key => logData[key] = obj[key]);
                // Ensure the logs directory exists
                const logPath = (_e = options.logPath) !== null && _e !== void 0 ? _e : "./logs/app.json";
                const logDir = node_path_1.default.dirname(logPath);
                if (!node_fs_1.default.existsSync(logDir)) {
                    node_fs_1.default.mkdirSync(logDir, { recursive: true });
                }
                // write logData to file
                const logString = JSON.stringify(logData) + "\n";
                node_fs_1.default.appendFile(logPath, logString, { flag: "a" }, (err) => {
                    if (err) {
                        console.error("Failed to write logData to file", err);
                    }
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = _g.return)) await _b.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    const closeFunc = () => {
        // console.info("Closing json transport")
    };
    // @ts-expect-error build function doesn't return anything
    return (0, pino_abstract_transport_1.default)(buildFunc, {
        close: closeFunc,
        expectPinoConfig: true,
    });
}
//# sourceMappingURL=transport.js.map