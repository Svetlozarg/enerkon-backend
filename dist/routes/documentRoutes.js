"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateTokenHandler_1 = require("../middleware/validateTokenHandler");
const documentController_1 = require("../controllers/documentController");
const router = express_1.default.Router();
router.get("/documents", validateTokenHandler_1.validateToken, documentController_1.getAllDocuments);
router.get("/:id", validateTokenHandler_1.validateToken, documentController_1.getDocumentById);
router.post("/create/:projectId", validateTokenHandler_1.validateToken, documentController_1.createDocument);
router.put("/update/:id", validateTokenHandler_1.validateToken, documentController_1.updateDocument);
router.delete("/delete", validateTokenHandler_1.validateToken, documentController_1.deleteDocument);
exports.default = router;
//# sourceMappingURL=documentRoutes.js.map