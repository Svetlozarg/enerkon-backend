"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const document_routes_1 = __importDefault(require("./routes/document.routes"));
const logger_1 = require("./helpers/logger");
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", auth_routes_1.default);
app.use("/api/project", project_routes_1.default);
app.use("/api/document", document_routes_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "404: Route Not Found" });
});
mongoose_1.default
    .connect(process.env.MONGO_CONNECTION_URL)
    .then((connect) => {
    (0, logger_1.success)(`Server successfully started and running on port ${PORT}`);
    (0, logger_1.success)(`Database successfully connected => Host: ${connect.connection.host} / DB Name: ${connect.connection.name}`);
    app.listen(PORT);
})
    .catch((err) => {
    (0, logger_1.error)("Failed to connect to database. Server is shutting down...");
    console.log("Error: ", err.message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map