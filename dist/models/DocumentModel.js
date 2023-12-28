"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Title field is required"],
    },
    project: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project is required"],
    },
    size: {
        type: Number,
        required: [true, "Size field is required"],
    },
    type: {
        type: String,
        required: [true, "Type is required"],
    },
    status: {
        type: String,
        enum: ["In process", "Canceled", "Finished"],
        default: "In process",
    },
    default: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Document", documentSchema);
//# sourceMappingURL=DocumentModel.js.map