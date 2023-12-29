"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectLog = exports.updateProjectLog = void 0;
const projectlog_model_1 = __importDefault(require("../models/projectlog.model"));
const logger_1 = require("./logger");
const updateProjectLog = (project, title, action, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projectLog = yield projectlog_model_1.default.findOne({ project });
        if (!projectLog) {
            projectLog = new projectlog_model_1.default({
                project,
                log: [{ title, action, date }],
            });
        }
        else {
            projectLog.log.push({ title, action, date });
        }
        const updatedProjectLog = yield projectLog.save();
        if (!updatedProjectLog) {
            (0, logger_1.error)(`Project log could not be created`);
            throw new Error("Project log not created");
        }
    }
    catch (err) {
        (0, logger_1.error)(`Project log could not be created`);
        throw new Error("Project log not created");
    }
});
exports.updateProjectLog = updateProjectLog;
const deleteProjectLog = (project) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProjectLog = yield projectlog_model_1.default.findOneAndDelete({ project });
        if (!deletedProjectLog) {
            (0, logger_1.error)(`Project log with the given project id not found `);
            throw new Error("Project log not found");
        }
    }
    catch (err) {
        (0, logger_1.error)(`Project log could not be deleted`);
        throw new Error("Project log not deleted");
    }
});
exports.deleteProjectLog = deleteProjectLog;
//# sourceMappingURL=logHelpers.js.map