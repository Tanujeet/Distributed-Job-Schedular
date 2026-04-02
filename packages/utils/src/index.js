"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.generateId = void 0;
var uuid_1 = require("uuid");
var generateId = function () {
    return (0, uuid_1.v4)();
};
exports.generateId = generateId;
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
