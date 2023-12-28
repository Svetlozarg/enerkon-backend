import express from "express";
import { validateToken } from "../middleware/validateTokenHandler";

const router = express.Router();

// router.get("/documents", validateToken, getAllDocuments);

export default router;
