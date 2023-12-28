import mongoose from "mongoose";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project, { ProjectModel } from "../models/ProjectModel";
import Document, { DocumentModel } from "../models/DocumentModel";
import ProjectLog, { ProjectLogModel } from "../models/ProjectLogModel";

//@desc Get all projects
//?@route GET /api/project/projects
//@access private
export const getAllProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const projects: ProjectModel[] = await Project.find();
    res.status(200).json({ success: true, data: projects });
  }
);

//@desc Get project by id
//?@route GET /api/project/:id
//@access private
export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const project: ProjectModel | null = await Project.findById(req.params.id);
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
    const project: ProjectModel | null = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    const documents: DocumentModel[] = await Document.find({
      project: new mongoose.Types.ObjectId(req.params.id),
    });
    res.status(200).json({ success: true, data: documents });
  }
);

//@desc Get a project log
//?@route GET /api/project/log/:id
//@access private
export const getProjectLog = asyncHandler(
  async (req: Request, res: Response) => {
    const projectLogs: ProjectLogModel[] = await ProjectLog.find({
      id: req.params.id,
    });
    if (!projectLogs) {
      res.status(404);
      throw new Error("Project log not found");
    }
    res.status(200).json({ success: true, data: projectLogs });
  }
);

//@desc Get projects analytics
//?@route GET /api/project/analytics
//@access private
export const getProjectsAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await Project.aggregate([
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
