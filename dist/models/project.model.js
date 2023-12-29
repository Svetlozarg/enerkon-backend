"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        ref: "User",
        required: true,
    },
    favourite: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
}, { timestamps: true });
const Project = mongoose_1.models.Project || (0, mongoose_1.model)("Project", ProjectSchema);
exports.default = Project;
//# sourceMappingURL=project.model.js.map