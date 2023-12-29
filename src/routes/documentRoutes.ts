import express from "express";
import { validateToken } from "../middleware/validateTokenHandler";
import {
  getDocumentById,
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController";

const router = express.Router();

router.get("/documents", validateToken, getAllDocuments);
router.get("/:id", validateToken, getDocumentById);
router.post("/create/:projectId", validateToken, createDocument);
router.put("/update/:id", validateToken, updateDocument);
router.delete("/delete", validateToken, deleteDocument);

export default router;
