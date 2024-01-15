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
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectsAnalytics = exports.getProjectLog = exports.getProjectDocuments = exports.getProjectById = exports.getAllProjects = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const project_model_1 = __importDefault(require("../models/project.model"));
const document_model_1 = __importDefault(require("../models/document.model"));
const projectlog_model_1 = __importDefault(require("../models/projectlog.model"));
const logHelpers_1 = require("../helpers/logHelpers");
const mongoose_1 = require("mongoose");
const logger_1 = require("../helpers/logger");
//@desc Get all projects
//?@route GET /api/project/:owner/projects
//@access private
exports.getAllProjects = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = req.params;
    if (!owner) {
        res.status(400);
        (0, logger_1.error)("Email is required");
        throw new Error("Email is required");
    }
    const projects = yield project_model_1.default.find({ owner: owner });
    res.status(200).json({ success: true, data: projects });
}));
//@desc Get a project by ID
//?@route GET /api/project/:id
//@access private
exports.getProjectById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(req.params.id);
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
    const projectId = req.params.id;
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    const documents = yield document_model_1.default.find({ project: projectId });
    res.status(200).json({ success: true, data: documents });
}));
//@desc Get a project log
//?@route GET /api/project/log/:id
//@access private
exports.getProjectLog = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectLogs = yield projectlog_model_1.default.find({ project: req.params.id });
    if (!projectLogs) {
        res.status(404);
        throw new Error("Project log not found");
    }
    res.status(200).json({ success: true, data: projectLogs });
}));
//@desc Get projects analytics
//?@route GET /api/project/:owner/analytics
//@access private
exports.getProjectsAnalytics = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = req.params;
    if (!owner) {
        res.status(400);
        (0, logger_1.error)("Email is required");
        throw new Error("Email is required");
    }
    const analytics = yield project_model_1.default.aggregate([
        {
            $match: { owner: owner },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                paidCount: {
                    $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
                },
                unpaidCount: {
                    $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] },
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
//@desc Create a project
//!@route POST /api/project/create
//@access private
exports.createProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, owner } = req.body;
    const project = new project_model_1.default({
        title,
        owner,
    });
    const createdProject = yield project.save();
    if (!createdProject) {
        res.status(400);
        (0, logger_1.error)("Invalid project data");
        throw new Error("Invalid project data");
    }
    (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(createdProject._id), createdProject.title, "Проектът е създаден", createdProject.createdAt);
    (0, logger_1.info)(`Project ${title} created successfully`);
    res.status(201).json({ success: true, data: createdProject });
}));
//@desc Update a project
//!@route PUT /api/project/update/:id
//@access private
exports.updateProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.id;
    const updatedData = req.body;
    const updatedProject = yield project_model_1.default.findByIdAndUpdate(projectId, updatedData, { new: true });
    let logMessage = "";
    if (updatedData.title && updatedData.status) {
        logMessage = "Заглавието и статуса са променени";
    }
    else if (updatedData.title) {
        logMessage = "Заглавието на проекта е променено";
    }
    else if (updatedData.status) {
        logMessage = "Статусът на проекта е променен";
    }
    else if (updatedData.favourite) {
        logMessage = "Проектът е добавен в любими";
    }
    else {
        logMessage = "Проектът е премахнат от любими";
    }
    if (!updatedProject) {
        res.status(404);
        (0, logger_1.error)("Project not found and cannot be updated");
        throw new Error("Project not found");
    }
    (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(projectId), updatedProject.title, logMessage, updatedProject.updatedAt);
    (0, logger_1.info)(`Project ${updatedProject.title} updated successfully`);
    res.status(200).json({ success: true, data: updatedProject });
}));
//@desc Delete a project
//!@route DELETE /api/project/delete
//@access private
exports.deleteProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const deletedProject = yield project_model_1.default.findByIdAndDelete(id);
    if (!deletedProject) {
        res.status(404);
        (0, logger_1.error)("Project not found and cannot be deleted");
        throw new Error("Project not found");
    }
    (0, logHelpers_1.deleteProjectLog)(id);
    (0, logger_1.info)("Project deleted successfully");
    res.json({
        success: true,
        message: "Project deleted successfully",
    });
}));
//# sourceMappingURL=project.controller.js.map