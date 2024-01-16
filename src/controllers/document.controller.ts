import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Document from "../models/document.model";
import Project from "../models/project.model";
import busboy from "busboy";
import { error, info as loggerInfo } from "../helpers/logger";
import { updateProjectLog } from "../helpers/logHelpers";
import { Types } from "mongoose";
import {
  deleteFileFromDrive,
  downloadFileFromDrive,
  getDocumentPreviewLink,
  uploadFileToGoogleDrive,
} from "../helpers/FileStorage/fileStorageHelpers";
import { createKCCDocument } from "../helpers/Documents/createKCCDocument";

//@desc Get all documents
//?@route GET /api/document/:owner/documents
//@access private
export const getAllDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner } = req.params;

    if (!owner) {
      res.status(400);
      error("Email is required");
      throw new Error("Email is required");
    }

    const documents = await Document.find({ owner: owner });

    res.status(200).json({
      success: true,
      data: documents,
    });
  }
);

//@desc Get a document by ID
//?@route GET /api/document/:id
//@access private
export const getDocumentById = asyncHandler(
  async (req: Request, res: Response) => {
    const document = await Document.findById(req.params.id);
    if (document) {
      res.status(200).json({ success: true, data: document });
    } else {
      res.status(404);
      throw new Error("Document not found");
    }
  }
);

//@desc Create a document
//!@route POST /api/document/create/:owner/:projectId
//@access private
export const createDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner, projectId } = req.params;

    if (!projectId) {
      res.status(400);
      error("Project ID is required");
      throw new Error("Project ID is required");
    }

    if (!owner) {
      res.status(400);
      error("Email is required");
      throw new Error("Email is required");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404);
      error("Project not found");
      throw new Error("Project not found");
    }

    const bb = busboy({ headers: req.headers });

    const projectName = project.title;

    let fileAdded = false;

    bb.on("file", async (name, file, info) => {
      const { filename, mimeType } = info;

      fileAdded = true;

      const document = new Document({
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
        const savedDocument = await document.save();

        const formattedFileName =
          filename === "Project.xml" || filename === "Master_file.xlsx"
            ? `${projectName}-${filename}`
            : filename;

        await uploadFileToGoogleDrive(formattedFileName, mimeType, file);

        updateProjectLog(
          new Types.ObjectId(projectId),
          savedDocument.title,
          "Файлът е създаден",
          savedDocument.updatedAt
        );

        loggerInfo(`Document ${filename} created successfully`);
        res.status(200).json({ success: true, data: savedDocument });
      } catch (err) {
        error(`Failed to save document ${filename}`);
        res.status(500).json({
          success: false,
          error: `Failed to save document ${filename}`,
        });
        throw new Error("Error: " + err.message);
      }
    });

    bb.on("finish", () => {
      if (!fileAdded) {
        res.status(400);
        error("No file added");
        throw new Error("No file added");
      }
    });

    req.pipe(bb);
  }
);

//@desc Update a document
//!@route PUT /api/document/update/:id
//@access private
export const updateDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = req.params.id;
    const updatedData = req.body;

    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      updatedData,
      { new: true }
    );

    if (!updatedDocument) {
      res.status(404);
      error("Document not found");
      throw new Error("Document not found");
    }

    let logMessage = "Документът е променен";

    if (updatedData.title && updatedData.status) {
      logMessage = "Заглавието и статуса са променени";
    } else if (updatedData.title) {
      logMessage = "Заглавието на файла е променено";
    } else if (updatedData.status) {
      logMessage = "Статусът на файла е променен";
    }

    updateProjectLog(
      new Types.ObjectId(updatedDocument.project),
      updatedDocument.title,
      logMessage,
      updatedDocument.updatedAt
    );

    loggerInfo(`Document ${updatedDocument.title} updated successfully`);

    res.json({
      success: true,
      message: logMessage,
      data: updatedDocument,
    });
  }
);

//@desc Delete a document
//!@route DELETE /api/document/delete
//@access private
export const deleteDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, fileName, projectName } = req.body;

    if (!id || !fileName) {
      res.status(400);
      error("Document ID and file name are required");
      throw new Error("Document ID and file name are required");
    }

    const deleteDocument = await Document.findByIdAndDelete(id);

    if (!deleteDocument) {
      res.status(404);
      res.json({
        success: false,
        message: `Document ${fileName} not found`,
      });
      error(`Document ${fileName} not found`);
      throw new Error(`Document ${fileName} not found`);
    }

    const formattedFileName =
      fileName === "Project.xml" || fileName === "Master_file.xlsx"
        ? `${projectName}-${fileName}`
        : fileName;

    deleteFileFromDrive(formattedFileName);

    loggerInfo(`Document ${fileName} deleted successfully`);

    updateProjectLog(
      new Types.ObjectId(id),
      fileName,
      "Файлът е изтрит",
      new Date()
    );

    res.json({
      success: true,
      message: `Document ${fileName} deleted successfully`,
    });
  }
);

//@desc Download a document
//?@route GET /api/document/download/:fileName
//@access private
export const downloadDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const fileName = req.params.fileName;

    const downloadedFile = await downloadFileFromDrive(fileName);

    const sanitizedFileName = encodeURIComponent(fileName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${sanitizedFileName}`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    downloadedFile.pipe(res);

    downloadedFile.on("error", (err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
  }
);

//@desc Get document link to google drive
//?@route GET /api/document/preview/:fileName
//@access private
export const getPreviewLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const previewLink = await getDocumentPreviewLink(fileName);
    res.status(200).json({
      success: true,
      data: previewLink,
    });
  }
);
