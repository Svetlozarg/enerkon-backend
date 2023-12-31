import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project from "../models/project.model";
import Document from "../models/document.model";
import ProjectLog from "../models/projectlog.model";
import { deleteProjectLog, updateProjectLog } from "../helpers/logHelpers";
import { Types } from "mongoose";
import { error, info } from "../helpers/logger";

//@desc Get all projects
//?@route GET /api/project/:owner/projects
//@access private
export const getAllProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner } = req.params;

    if (!owner) {
      res.status(400);
      error("Email is required");
      throw new Error("Email is required");
    }

    const projects = await Project.find({ owner: owner });
    res.status(200).json({ success: true, data: projects });
  }
);

//@desc Get a project by ID
//?@route GET /api/project/:id
//@access private
export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.status(200).json({ success: true, data: project });
    } else {
      res.status(404);
      throw new Error("Project not found");
    }
  }
);

//@desc Get project documents
//?@route GET /api/project/:id/documents
//@access private
export const getProjectDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const documents = await Document.find({ project: projectId });

    res.status(200).json({ success: true, data: documents });
  }
);

//@desc Get a project log
//?@route GET /api/project/log/:id
//@access private
export const getProjectLog = asyncHandler(
  async (req: Request, res: Response) => {
    const projectLogs = await ProjectLog.find({ project: req.params.id });
    if (!projectLogs) {
      res.status(404);
      throw new Error("Project log not found");
    }
    res.status(200).json({ success: true, data: projectLogs });
  }
);

//@desc Get projects analytics
//?@route GET /api/project/analytics/:owner
//@access private
export const getProjectsAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner } = req.params;

    if (!owner) {
      res.status(400);
      error("Email is required");
      throw new Error("Email is required");
    }

    const analytics = await Project.aggregate([
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

    const paidArray: number[] = Array(12).fill(0);
    const unpaidArray: number[] = Array(12).fill(0);

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
  }
);

//@desc Create a project
//!@route POST /api/project/:owner/create
//@access private
export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { title } = req.body;
    const { owner } = req.params;

    const project = new Project({
      title,
      owner,
    });

    const createdProject = await project.save();

    if (!createdProject) {
      res.status(400);
      error("Invalid project data");
      throw new Error("Invalid project data");
    }

    updateProjectLog(
      new Types.ObjectId(createdProject._id),
      createdProject.title,
      "Проектът е създаден",
      createdProject.createdAt
    );

    info(`Project ${title} created successfully`);

    res.status(201).json({ success: true, data: createdProject });
  }
);

//@desc Update a project
//!@route PUT /api/project/update/:id
//@access private
export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const updatedData = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }
    );

    let logMessage = "";

    if (updatedData.title && updatedData.status) {
      logMessage = "Заглавието и статуса са променени";
    } else if (updatedData.title) {
      logMessage = "Заглавието на проекта е променено";
    } else if (updatedData.status) {
      logMessage = "Статусът на проекта е променен";
    } else if (updatedData.favourite) {
      logMessage = "Проектът е добавен в любими";
    } else {
      logMessage = "Проектът е премахнат от любими";
    }

    if (!updatedProject) {
      res.status(404);
      error("Project not found and cannot be updated");
      throw new Error("Project not found");
    }

    updateProjectLog(
      new Types.ObjectId(projectId),
      updatedProject.title,
      logMessage,
      updatedProject.updatedAt
    );

    info(`Project ${updatedProject.title} updated successfully`);

    res.status(200).json({ success: true, data: updatedProject });
  }
);

//@desc Delete a project
//!@route DELETE /api/project/delete
//@access private
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      res.status(404);
      error("Project not found and cannot be deleted");
      throw new Error("Project not found");
    }

    deleteProjectLog(id);

    info("Project deleted successfully");

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  }
);
