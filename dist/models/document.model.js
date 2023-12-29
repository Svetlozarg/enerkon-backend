"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
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
const Document = mongoose_1.models.Document || (0, mongoose_1.model)("Document", documentSchema);
exports.default = Document;
//# sourceMappingURL=document.model.js.map