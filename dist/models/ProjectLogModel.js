"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectLogSchema = new mongoose_1.default.Schema({
    project: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Project ID is required"],
    },
    log: [
        {
            title: {
                type: String,
                required: [true, "Title field is required"],
            },
            action: {
                type: String,
                required: [true, "Action field is required"],
            },
            date: {
                type: Date,
                required: [true, "Date field is required"],
            },
        },
    ],
});
exports.default = mongoose_1.default.model("ProjectLog", projectLogSchema);
//# sourceMappingURL=ProjectLogModel.js.map