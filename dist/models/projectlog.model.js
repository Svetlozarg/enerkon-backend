"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectLogSchema = new mongoose_1.Schema({
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    log: [
        {
            title: {
                type: String,
                required: true,
            },
            action: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
});
const ProjectLog = mongoose_1.models.ProjectLog || (0, mongoose_1.model)("ProjectLog", projectLogSchema);
exports.default = ProjectLog;
//# sourceMappingURL=projectlog.model.js.map