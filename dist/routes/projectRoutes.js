"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateTokenHandler_1 = require("../middleware/validateTokenHandler");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.get("/projects", validateTokenHandler_1.validateToken, projectController_1.getAllProjects);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map