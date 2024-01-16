"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateTokenHandler_1 = require("../middleware/validateTokenHandler");
const document_controller_1 = require("../controllers/document.controller");
const router = express_1.default.Router();
router.get("/:owner/documents", validateTokenHandler_1.validateToken, document_controller_1.getAllDocuments);
router.get("/:id", validateTokenHandler_1.validateToken, document_controller_1.getDocumentById);
router.post("/create/:owner/:projectId", validateTokenHandler_1.validateToken, document_controller_1.createDocument);
router.put("/update/:id", validateTokenHandler_1.validateToken, document_controller_1.updateDocument);
router.delete("/delete", validateTokenHandler_1.validateToken, document_controller_1.deleteDocument);
router.get("/preview/:fileName", validateTokenHandler_1.validateToken, document_controller_1.getPreviewLink);
router.get("/download/:fileName", validateTokenHandler_1.validateToken, document_controller_1.downloadDocument);
router.post("/generate/kcc", validateTokenHandler_1.validateToken, document_controller_1.generateKCCDocument);
exports.default = router;
//# sourceMappingURL=document.routes.js.map