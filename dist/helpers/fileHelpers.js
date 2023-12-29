"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileMimeType = exports.getFileName = void 0;
const path_1 = __importDefault(require("path"));
const getFileName = (filePath) => {
    return path_1.default.basename(filePath);
};
exports.getFileName = getFileName;
const getFileMimeType = (fileExtension) => {
    switch (fileExtension) {
        case "pdf":
            return "application/pdf";
        case "xml":
            return "application/xml";
        case "xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "docs":
            return "application/vnd.google-apps.document";
        default:
            return "application/octet-stream";
    }
};
exports.getFileMimeType = getFileMimeType;
//# sourceMappingURL=fileHelpers.js.map