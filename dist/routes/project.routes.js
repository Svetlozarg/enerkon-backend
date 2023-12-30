"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateTokenHandler_1 = require("../middleware/validateTokenHandler");
const project_controller_1 = require("../controllers/project.controller");
const router = express_1.default.Router();
router.get("/projects", validateTokenHandler_1.validateToken, project_controller_1.getAllProjects);
router.get("/:id", validateTokenHandler_1.validateToken, project_controller_1.getProjectById);
router.get("/:id/documents", validateTokenHandler_1.validateToken, project_controller_1.getProjectDocuments);
router.get("/log/:id", validateTokenHandler_1.validateToken, project_controller_1.getProjectLog);
router.get("/projects/analytics", validateTokenHandler_1.validateToken, project_controller_1.getProjectsAnalytics);
router.post("/create", validateTokenHandler_1.validateToken, project_controller_1.createProject);
router.put("/update/:id", validateTokenHandler_1.validateToken, project_controller_1.updateProject);
router.delete("/delete", validateTokenHandler_1.validateToken, project_controller_1.deleteProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map