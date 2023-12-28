"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Username field is required"],
    },
    email: {
        type: String,
        required: [true, "Email address field is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=UserModel.js.map