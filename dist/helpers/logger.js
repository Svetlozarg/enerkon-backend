"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.error = exports.info = void 0;
const chalk_1 = __importDefault(require("chalk"));
function info(message) {
    console.log(chalk_1.default.bgBlue(`INFO: ${message}`));
}
exports.info = info;
function error(message) {
    console.error(chalk_1.default.bgRed(`ERROR: ${message}`));
}
exports.error = error;
function success(message) {
    console.log(chalk_1.default.bgHex("#008000")(`${message}`));
}
exports.success = success;
//# sourceMappingURL=logger.js.map