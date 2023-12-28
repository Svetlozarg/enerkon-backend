"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.validateToken = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decoded === null || decoded === void 0 ? void 0 : decoded.user;
            next();
        });
        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }
    }
}));
//# sourceMappingURL=validateTokenHandler.js.map