'use strict';

var fs = require('fs');
var path = require('path');
var ci = require('miniprogram-ci');
var child_process = require('child_process');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// for now just expose the builtin process global from node.js
var process$1 = commonjsGlobal.process;

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var _log_color = {
    log: "\x1B[37m",
    success: "\x1B[32m",
    warning: "\x1B[33m",
    error: "\x1B[31m",
    aqua: "\x1B[96m"
};
function dye(color, msg) {
    return _log_color[color] + "".concat(msg);
}
var log = Object.entries(_log_color).reduce(function (acc, _a) {
    var _b;
    var method = _a[0], color = _a[1];
    return (__assign(__assign({}, acc), (_b = {}, _b[method] = function (msg) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([color + msg], arg, false));
    }, _b)));
}, {});

var CONFIG_PATH = "weapp-upload.config.js";

function templateConfig() {
    return "import { defineConfig } from \"taro-weapp-upload\";\n\nexport default defineConfig({\n  version: \"0.0.0\",\n  /** \u9700\u8981\u4E0A\u4F20\u7684\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F appid */\n  appid: [],\n  /** \u4E0A\u4F20\u63CF\u8FF0 */\n  description: \"\",\n  /** \u5C0F\u7A0B\u5E8F\u9879\u76EE\u6839\u76EE\u5F55 \u5373 project.config.json \u6240\u5728\u7684\u76EE\u5F55 */\n  projectPath: \"/deploy/build/weapp/\",\n  /**\n   * \u5B58\u653E\u4E0A\u4F20key\u7684\u6587\u4EF6\u5939\n   * \u91CC\u9762\u5BC6\u94A5\u6587\u4EF6\u7684\u547D\u540D\u683C\u5F0F\uFF1A".concat("private.${appid}.key", "\n   * \u5177\u4F53\u83B7\u53D6\u65B9\u5F0F\u770B\u6587\u6863\n   * @see https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E5%AF%86%E9%92%A5%E5%8F%8A-IP-%E7%99%BD%E5%90%8D%E5%8D%95%E9%85%8D%E7%BD%AE\n  */\n  privateKeyPath: \"/key/\"\n})\n");
}

function init() {
    fs.writeFileSync(path.join(process$1.cwd(), CONFIG_PATH), templateConfig());
}

function dateFormat(dateStr) {
    var date = new Date(dateStr);
    return "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate(), " ").concat(date.getHours(), ":").concat(date.getMinutes(), ":").concat(date.getSeconds());
}

function matchStr(baseString, regex) {
    var _a, _b;
    return (_b = (_a = baseString.match(regex)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.trim();
}
function lastCommit() {
    try {
        var logStr = child_process.execSync("git log -1").toString();
        var logBranchStr = child_process.execSync("git branch").toString();
        return {
            commit: matchStr(logStr, /(?<=commit).+/g),
            merge: matchStr(logStr, /(?<=Merge:).+/g),
            author: matchStr(logStr, /(?<=Author:).+/g),
            date: dateFormat(matchStr(logStr, /(?<=Date:).+/g)),
            info: matchStr(logStr, /\n\n.*/g),
            branch: matchStr(logBranchStr, /(?<=\*\s)\S+/),
            buildTime: dateFormat(new Date())
        };
    }
    catch (err) {
        throw new Error(err);
    }
}

/**
 * 格式化描述
 */
function formatDescription(description, baseData) {
    if (!description)
        return undefined;
    var mapping = {
        "${TIME}": baseData.buildTime,
        "${VERSION}": baseData.version,
        "${AUTHOR}": baseData.author,
        "${BRANCH}": baseData.branch,
        "${COMMIT}": baseData.commit,
        "${DATE}": baseData.date,
        "${INFO}": baseData.info
    };
    return Object.entries(mapping).reduce(function (des, _a) {
        var tmp = _a[0], val = _a[1];
        return des.replace(tmp, val);
    }, description);
}

function readProjectConfig(projectPath) {
    try {
        var configStr = fs
            .readFileSync(path.join(process.cwd(), "".concat(projectPath, "/project.config.json")))
            .toString();
        return JSON.parse(configStr) || {};
    }
    catch (err) {
        log.warning("获取 config 失败!");
        return {};
    }
}
function uploadAction(config) {
    return __awaiter(this, void 0, void 0, function () {
        var commitInfo, desc, setting, appidList, version, resolveList, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commitInfo = lastCommit();
                    desc = formatDescription(config.description, __assign(__assign({}, commitInfo), { version: config.version }));
                    log.log("准备上传小程序到微信");
                    setting = readProjectConfig(config.projectPath).setting;
                    appidList = config.appid, version = config.version;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(appidList.map(function (appid) { return __awaiter(_this, void 0, void 0, function () {
                            var project, uploadResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!fs.existsSync("".concat(path.join(process.cwd(), config.privateKeyPath), "/private.").concat(appid, ".key"))) {
                                            log.warning("Warring:" + "".concat(appid, ": key\u4E0D\u5B58\u5728\uFF0C\u4E2D\u65AD\u4E0A\u4F20"));
                                            return [2 /*return*/];
                                        }
                                        log.log("".concat(appid, "\u751F\u6210project"));
                                        project = new ci.Project({
                                            appid: appid,
                                            type: "miniProgram",
                                            projectPath: "".concat(path.join(process.cwd(), config.projectPath)),
                                            privateKeyPath: config.privateKeyPath &&
                                                "".concat(path.join(process.cwd(), config.privateKeyPath), "/private.").concat(appid, ".key"),
                                            ignores: ["node_modules/**/*"]
                                        });
                                        log.log("".concat(appid, "\u751F\u6210project\u6210\u529F"));
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, ci.upload({
                                                project: project,
                                                version: version,
                                                desc: desc,
                                                setting: setting
                                            })];
                                    case 2:
                                        uploadResult = _a.sent();
                                        return [2 /*return*/, { appid: appid, uploadResult: uploadResult }];
                                    case 3:
                                        _a.sent();
                                        log.warning("Warring:" + "".concat(appid, ": \u4E0A\u4F20\u5931\u8D25\uFF01"));
                                        throw new Error("".concat(appid, ": \u4E0A\u4F20\u5931\u8D25\uFF01"));
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    resolveList = _a.sent();
                    log.log("\u4E0A\u4F20\u5B8C\u6210\uFF1A[".concat(version, "] ").concat(commitInfo.info));
                    resolveList.forEach(function (_a) {
                        var appid = _a.appid;
                        log.success("".concat(appid, " \u4E0A\u4F20\u5B8C\u6210"));
                    });
                    log.log("------各分包大小------");
                    resolveList[0].uploadResult.subPackageInfo.forEach(function (item) {
                        return log.log(dye("success", "".concat(item.name, "\uFF1A")) +
                            dye("warning", "".concat((item.size / 1024).toFixed(2), "/").concat(2048, "KB")));
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    log.error("Error:" + error_1.message);
                    return [3 /*break*/, 4];
                case 4:
                    log.log("---------------------");
                    return [2 /*return*/];
            }
        });
    });
}

exports.init = init;
exports.uploadAction = uploadAction;
