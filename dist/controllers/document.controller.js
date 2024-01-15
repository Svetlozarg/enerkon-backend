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
exports.getPreviewLink = exports.downloadDocument = exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocumentById = exports.getAllDocuments = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const document_model_1 = __importDefault(require("../models/document.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const busboy_1 = __importDefault(require("busboy"));
const logger_1 = require("../helpers/logger");
const logHelpers_1 = require("../helpers/logHelpers");
const mongoose_1 = require("mongoose");
const fileStorageHelpers_1 = require("../helpers/FileStorage/fileStorageHelpers");
//@desc Get all documents
//?@route GET /api/document/:owner/documents
//@access private
exports.getAllDocuments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = req.params;
    if (!owner) {
        res.status(400);
        (0, logger_1.error)("Email is required");
        throw new Error("Email is required");
    }
    const documents = yield document_model_1.default.find({ owner: owner });
    res.status(200).json({
        success: true,
        data: documents,
    });
}));
//@desc Get a document by ID
//?@route GET /api/document/:id
//@access private
exports.getDocumentById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield document_model_1.default.findById(req.params.id);
    if (document) {
        res.status(200).json({ success: true, data: document });
    }
    else {
        res.status(404);
        throw new Error("Document not found");
    }
}));
//@desc Create a document
//!@route POST /api/document/create/:owner/:projectId
//@access private
exports.createDocument = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, projectId } = req.params;
    if (!projectId) {
        res.status(400);
        (0, logger_1.error)("Project ID is required");
        throw new Error("Project ID is required");
    }
    if (!owner) {
        res.status(400);
        (0, logger_1.error)("Email is required");
        throw new Error("Email is required");
    }
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        res.status(404);
        (0, logger_1.error)("Project not found");
        throw new Error("Project not found");
    }
    const bb = (0, busboy_1.default)({ headers: req.headers });
    const projectName = project.title;
    let fileAdded = false;
    bb.on("file", (name, file, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { filename, mimeType } = info;
        fileAdded = true;
        const document = new document_model_1.default({
            title: filename,
            owner: owner,
            project: projectId,
            size: 0.1,
            type: mimeType,
            default: true
                ? filename === "Project.xml" || filename === "Master_file.xlsx"
                : false,
        });
        try {
            const savedDocument = yield document.save();
            const formattedFileName = filename === "Project.xml" || filename === "Master_file.xlsx"
                ? `${projectName}-${filename}`
                : filename;
            yield (0, fileStorageHelpers_1.uploadFileToGoogleDrive)(formattedFileName, mimeType, file);
            (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(projectId), savedDocument.title, "Файлът е създаден", savedDocument.updatedAt);
            (0, logger_1.info)(`Document ${filename} created successfully`);
            res.status(200).json({ success: true, data: savedDocument });
        }
        catch (err) {
            (0, logger_1.error)(`Failed to save document ${filename}`);
            res.status(500).json({
                success: false,
                error: `Failed to save document ${filename}`,
            });
            throw new Error("Error: " + err.message);
        }
    }));
    bb.on("finish", () => {
        if (!fileAdded) {
            res.status(400);
            (0, logger_1.error)("No file added");
            throw new Error("No file added");
        }
    });
    req.pipe(bb);
}));
//@desc Update a document
//!@route PUT /api/document/update/:id
//@access private
exports.updateDocument = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentId = req.params.id;
    const updatedData = req.body;
    const updatedDocument = yield document_model_1.default.findByIdAndUpdate(documentId, updatedData, { new: true });
    if (!updatedDocument) {
        res.status(404);
        (0, logger_1.error)("Document not found");
        throw new Error("Document not found");
    }
    let logMessage = "Документът е променен";
    if (updatedData.title && updatedData.status) {
        logMessage = "Заглавието и статуса са променени";
    }
    else if (updatedData.title) {
        logMessage = "Заглавието на файла е променено";
    }
    else if (updatedData.status) {
        logMessage = "Статусът на файла е променен";
    }
    (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(updatedDocument.project), updatedDocument.title, logMessage, updatedDocument.updatedAt);
    (0, logger_1.info)(`Document ${updatedDocument.title} updated successfully`);
    res.json({
        success: true,
        message: logMessage,
        data: updatedDocument,
    });
}));
//@desc Delete a document
//!@route DELETE /api/document/delete
//@access private
exports.deleteDocument = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, fileName, projectName } = req.body;
    if (!id || !fileName) {
        res.status(400);
        (0, logger_1.error)("Document ID and file name are required");
        throw new Error("Document ID and file name are required");
    }
    const deleteDocument = yield document_model_1.default.findByIdAndDelete(id);
    if (!deleteDocument) {
        res.status(404);
        res.json({
            success: false,
            message: `Document ${fileName} not found`,
        });
        (0, logger_1.error)(`Document ${fileName} not found`);
        throw new Error(`Document ${fileName} not found`);
    }
    const formattedFileName = fileName === "Project.xml" || fileName === "Master_file.xlsx"
        ? `${projectName}-${fileName}`
        : fileName;
    (0, fileStorageHelpers_1.deleteFileFromDrive)(formattedFileName);
    (0, logger_1.info)(`Document ${fileName} deleted successfully`);
    (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(id), fileName, "Файлът е изтрит", new Date());
    res.json({
        success: true,
        message: `Document ${fileName} deleted successfully`,
    });
}));
//@desc Download a document
//?@route GET /api/document/download/:fileName
//@access private
exports.downloadDocument = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.params.fileName;
    const downloadedFile = yield (0, fileStorageHelpers_1.downloadFileFromDrive)(fileName);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(downloadedFile);
}));
//@desc Get document link to google drive
//?@route GET /api/document/preview/:fileName
//@access private
exports.getPreviewLink = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    const previewLink = yield (0, fileStorageHelpers_1.getDocumentPreviewLink)(fileName);
    res.status(200).json({
        success: true,
        data: previewLink,
    });
}));
//# sourceMappingURL=document.controller.js.map