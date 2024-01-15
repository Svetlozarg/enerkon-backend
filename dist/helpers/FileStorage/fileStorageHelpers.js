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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentPreviewLink = exports.deleteFileFromDrive = exports.downloadFileFromDrive = exports.uploadFileToGoogleDrive = void 0;
const googleapis_1 = require("googleapis");
const logger_1 = require("../logger");
const stream_1 = require("stream");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const authorize = () => __awaiter(void 0, void 0, void 0, function* () {
    const jwtClient = new googleapis_1.google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY, SCOPE);
    yield jwtClient.authorize();
    return jwtClient;
});
const uploadFileToGoogleDrive = (filename, mimeType, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authClient = yield authorize();
        const drive = googleapis_1.google.drive({ version: "v3", auth: authClient });
        let fileStream;
        if (Buffer.isBuffer(file)) {
            fileStream = stream_1.Readable.from(file);
        }
        else {
            fileStream = file;
        }
        const uploadFile = yield drive.files.create({
            fields: "id",
            media: {
                body: fileStream,
                mimeType: mimeType,
            },
            requestBody: {
                name: filename,
                parents: ["1DeaVaoSLAR9n6R5UdhKi0VURCQVSPeC4"],
            },
        });
        if (uploadFile) {
            (0, logger_1.info)(`File ${filename} uploaded successfully`);
        }
    }
    catch (error) {
        error(error);
    }
});
exports.uploadFileToGoogleDrive = uploadFileToGoogleDrive;
// TODO
const downloadFileFromDrive = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const authClient = yield authorize();
    const drive = googleapis_1.google.drive({ version: "v3", auth: authClient });
    const file = yield drive.files.list({
        q: `name='${fileName}'`,
        fields: "files(id)",
    });
    if (file.data.files.length === 0) {
        throw new Error("File not found");
    }
    const fileId = file.data.files[0].id;
    const response = yield drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
    if (response.data) {
        (0, logger_1.info)("File downloaded successfully");
        return response.data;
    }
    else {
        (0, logger_1.error)("Error downloading file");
        throw new Error("Error downloading file");
    }
});
exports.downloadFileFromDrive = downloadFileFromDrive;
const deleteFileFromDrive = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const authClient = yield authorize();
    const drive = googleapis_1.google.drive({ version: "v3", auth: authClient });
    const file = yield drive.files.list({
        q: `name='${fileName}'`,
        fields: "files(id)",
    });
    if (file.data.files.length === 0) {
        (0, logger_1.error)("Google Drive: File not found");
        throw new Error("Google Drive: File not found");
    }
    const fileId = file.data.files[0].id;
    try {
        yield drive.files.delete({ fileId });
        (0, logger_1.info)("File deleted successfully.");
    }
    catch (error) {
        error("Error deleting file:", error);
    }
});
exports.deleteFileFromDrive = deleteFileFromDrive;
const getDocumentPreviewLink = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const authClient = yield authorize();
    const drive = googleapis_1.google.drive({ version: "v3", auth: authClient });
    const file = yield drive.files.list({
        q: `name='${fileName}'`,
        fields: "files(webViewLink)",
    });
    if (file.data.files.length === 0) {
        (0, logger_1.error)("Google Drive: File not found");
        throw new Error("Google Drive: File not found");
    }
    const fileId = file.data.files[0].webViewLink;
    return fileId;
});
exports.getDocumentPreviewLink = getDocumentPreviewLink;
//# sourceMappingURL=fileStorageHelpers.js.map