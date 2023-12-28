import express from "express";
import { validateToken } from "../middleware/validateTokenHandler";
import { getAllProjects } from "../controllers/projectController";

const router = express.Router();

router.get("/projects", validateToken, getAllProjects);

export default router;
