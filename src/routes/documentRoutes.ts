import express from "express";
import { validateToken } from "../middleware/validateTokenHandler";
// import {
//   getAllDocuments,
//   getDocumentById,
//   createDocument,
//   updateDocument,
//   deleteDocument,
// } from "../controllers/documentController";

const router = express.Router();

// router.get("/documents", validateToken, getAllDocuments);
// router.get("/:id", validateToken, getDocumentById);
// router.post("/create", validateToken, createDocument);
// router.put("/update/:id", validateToken, updateDocument);
// router.delete("/delete", validateToken, deleteDocument);

export default router;
