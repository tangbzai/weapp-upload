#!/usr/bin/env node
'use strict';

var commander = require('commander');
var readline = require('readline');
var path = require('path');
var fs = require('fs');
var ci = require('miniprogram-ci');
var child_process = require('child_process');

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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// for now just expose the builtin process global from node.js
var process$1 = commonjsGlobal.process;

var CONFIG_PATH = "wx-upload-config.json";
function getConfig() {
    if (!fs.existsSync(path.join(process.cwd(), CONFIG_PATH))) {
        console.log("".concat(CONFIG_PATH, "\u4E0D\u5B58\u5728"));
        return {};
    }
    var configStr = fs.readFileSync(path.join(process.cwd(), CONFIG_PATH), {
        encoding: "utf8"
    });
    try {
        var config = JSON.parse(configStr);
        return __assign(__assign({}, config), { appid: typeof config.appid === "string" ? [config.appid] : config.appid });
    }
    catch (err) {
        console.warn("\x1B[33mWarring:" + "配置文件解析失败,请检查!");
        return {};
    }
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
            branch: matchStr(logBranchStr, /^(?<=\*\s)\S+/),
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
function uploadAction(config) {
    return __awaiter(this, void 0, void 0, function () {
        var commitInfo, desc, setting, appidList, version;
        var _this = this;
        return __generator(this, function (_a) {
            commitInfo = lastCommit();
            desc = formatDescription(config.description, __assign(__assign({}, commitInfo), { version: config.version }));
            console.log("准备上传小程序到微信");
            console.log("生成project");
            setting = readProjectConfig(config.projectPath).setting;
            appidList = config.appid, version = config.version;
            appidList.forEach(function (appid) { return __awaiter(_this, void 0, void 0, function () {
                var project, uploadResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!fs.existsSync("".concat(process.cwd(), "/key/private.").concat(appid, ".key"))) {
                                console.warn("\x1B[33mWarring:" + "".concat(appid, ": key\u4E0D\u5B58\u5728\uFF0C\u4E2D\u65AD\u4E0A\u4F20"));
                                return [2 /*return*/];
                            }
                            project = new ci.Project({
                                appid: appid,
                                type: "miniProgram",
                                projectPath: "".concat(process.cwd(), "/deploy/build/weapp/"),
                                privateKeyPath: "".concat(process.cwd(), "/key/private.").concat(appid, ".key"),
                                ignores: ["node_modules/**/*"]
                            });
                            console.log("生成project成功");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, ci.upload({ project: project, version: version, desc: desc, setting: setting })];
                        case 2:
                            uploadResult = _a.sent();
                            console.log("\u001B[32m".concat(appid, " \u4E0A\u4F20\u5B8C\u6210:[").concat(version, "] ").concat(commitInfo.info));
                            console.log("\x1B[37m------各分包大小------");
                            uploadResult.subPackageInfo.forEach(function (item) {
                                return console.log("\u001B[32m".concat(item.name, ":") +
                                    "\u001B[33m".concat((item.size / 1024).toFixed(2), "/").concat(2048, "KB"));
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            console.warn("\x1B[33mWarring:" + "".concat(appid, ": \u4E0A\u4F20\u5931\u8D25\uFF01"));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            console.log("\x1B[37m---------------------");
            return [2 /*return*/];
        });
    });
}
function readProjectConfig(projectPath) {
    try {
        var configStr = fs
            .readFileSync(path.join(process.cwd(), "".concat(projectPath, "/project.config.json")))
            .toString();
        return JSON.parse(configStr) || {};
    }
    catch (err) {
        console.error("获取 config 失败!");
        return {};
    }
}

var upload = commander.program.command("upload");
/**
 * Promise 版的 question
 */
function question(query) {
    var readline$1 = readline.createInterface({
        input: process$1.stdin,
        output: process$1.stdout
    });
    return new Promise(function (resolve) {
        readline$1.question(query, function (answer) {
            resolve(answer);
            readline$1.close();
        });
    });
}
upload.action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, version, appidStr, appid;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                config = getConfig();
                if (!!config.version) return [3 /*break*/, 2];
                return [4 /*yield*/, question("\x1B[96m" + "请输入版本号:")];
            case 1:
                version = _b.sent();
                config.version = version;
                _b.label = 2;
            case 2:
                if (!!((_a = config.appid) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, question("\x1B[96m" + "请输入appid(多个小程序用','分隔):")];
            case 3:
                appidStr = _b.sent();
                appid = appidStr
                    .split(",")
                    .map(function (item) { return item.trim(); })
                    .filter(function (t) { return t; });
                config.appid = appid;
                _b.label = 4;
            case 4: return [4 /*yield*/, uploadAction(config)];
            case 5:
                _b.sent();
                process$1.exit();
                return [2 /*return*/];
        }
    });
}); });
commander.program.addCommand(upload);
commander.program.parse(process$1.argv);
