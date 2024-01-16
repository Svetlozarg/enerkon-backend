import express from "express";
import { validateToken } from "../middleware/validateTokenHandler";
import {
  getDocumentById,
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  getPreviewLink,
  downloadDocument,
  generateKCCDocument,
} from "../controllers/document.controller";

const router = express.Router();

router.get("/:owner/documents", validateToken, getAllDocuments);
router.get("/:id", validateToken, getDocumentById);
router.post("/create/:owner/:projectId", validateToken, createDocument);
router.put("/update/:id", validateToken, updateDocument);
router.delete("/delete", validateToken, deleteDocument);
router.get("/preview/:fileName", validateToken, getPreviewLink);
router.get("/download/:fileName", validateToken, downloadDocument);
router.post("/generate/kcc", validateToken, generateKCCDocument);

export default router;
