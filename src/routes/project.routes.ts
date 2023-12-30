import express from "express";
import { validateToken } from "../middleware/validateTokenHandler";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectDocuments,
  getProjectLog,
  getProjectsAnalytics,
  updateProject,
} from "../controllers/project.controller";

const router = express.Router();

router.get("/projects", validateToken, getAllProjects);
router.get("/:id", validateToken, getProjectById);

router.get("/:id/documents", validateToken, getProjectDocuments);

router.get("/log/:id", validateToken, getProjectLog);

router.get("/projects/analytics/:owner", validateToken, getProjectsAnalytics);

router.post("/create", validateToken, createProject);
router.put("/update/:id", validateToken, updateProject);
router.delete("/delete", validateToken, deleteProject);

export default router;
