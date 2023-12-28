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
exports.getProjectsAnalytics = exports.getProjectLog = exports.getProjectDocuments = exports.getProjectById = exports.getAllProjects = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ProjectModel_1 = __importDefault(require("../models/ProjectModel"));
const DocumentModel_1 = __importDefault(require("../models/DocumentModel"));
const ProjectLogModel_1 = __importDefault(require("../models/ProjectLogModel"));
//@desc Get all projects
//?@route GET /api/project/projects
//@access private
exports.getAllProjects = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield ProjectModel_1.default.find();
    res.status(200).json({ success: true, data: projects });
}));
//@desc Get project by id
//?@route GET /api/project/:id
//@access private
exports.getProjectById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield ProjectModel_1.default.findById(req.params.id);
    if (project) {
        res.status(200).json({ success: true, data: project });
    }
    else {
        res.status(404);
        throw new Error("Project not found");
    }
}));
//@desc Get project documents
//?@route GET /api/project/:id/documents
//@access private
exports.getProjectDocuments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield ProjectModel_1.default.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    const documents = yield DocumentModel_1.default.find({
        project: new mongoose_1.default.Types.ObjectId(req.params.id),
    });
    res.status(200).json({ success: true, data: documents });
}));
//@desc Get a project log
//?@route GET /api/project/log/:id
//@access private
exports.getProjectLog = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectLogs = yield ProjectLogModel_1.default.find({
        id: req.params.id,
    });
    if (!projectLogs) {
        res.status(404);
        throw new Error("Project log not found");
    }
    res.status(200).json({ success: true, data: projectLogs });
}));
//@desc Get projects analytics
//?@route GET /api/project/analytics
//@access private
exports.getProjectsAnalytics = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const analytics = yield ProjectModel_1.default.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                paidCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
                },
                unpaidCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Unpaid"] }, 1, 0] },
                },
            },
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 },
        },
    ]);
    const paidArray = Array(12).fill(0);
    const unpaidArray = Array(12).fill(0);
    analytics.forEach((entry) => {
        const monthIndex = entry._id.month - 1;
        paidArray[monthIndex] += entry.paidCount;
        unpaidArray[monthIndex] += entry.unpaidCount;
    });
    res.json({
        success: true,
        data: {
            paid: paidArray,
            unpaid: unpaidArray,
        },
    });
}));
//# sourceMappingURL=projectController.js.map