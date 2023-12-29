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
exports.getDocumentPreviewLink = exports.deleteFileFromDrive = exports.downloadFileFromDrive = exports.uploadFileToDrive = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const fileHelpers_1 = require("../fileHelpers");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const authorize = () => __awaiter(void 0, void 0, void 0, function* () {
    const jwtClient = new googleapis_1.google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY, SCOPE);
    yield jwtClient.authorize();
    return jwtClient;
});
const uploadFile = (authClient, filePath) => {
    return new Promise((resolve, rejected) => {
        const drive = googleapis_1.google.drive({ version: "v3", auth: authClient });
        const fileExtension = filePath.split(".").pop();
        const mimeType = (0, fileHelpers_1.getFileMimeType)(fileExtension);
        const fileMetaData = {
            name: (0, fileHelpers_1.getFileName)(filePath),
            parents: ["1DeaVaoSLAR9n6R5UdhKi0VURCQVSPeC4"],
        };
        drive.files.create({
            requestBody: fileMetaData,
            media: {
                body: fs_1.default.createReadStream(filePath),
                mimeType: mimeType,
            },
            fields: "id",
        }, function (error, file) {
            if (error) {
                return rejected(error);
            }
            resolve(file);
        });
    });
};
const uploadFileToDrive = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authClient = yield authorize();
        const file = yield uploadFile(authClient, filePath);
        if (!file) {
            throw new Error("Error while uploading file");
        }
        else {
            console.log("%cFile uploaded successfully", "background-color: green");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.uploadFileToDrive = uploadFileToDrive;
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
    const dest = fs_1.default.createWriteStream(`./uploads/${fileName}`);
    response.data
        .on("end", () => {
        console.log("Done downloading file.");
    })
        .on("error", (err) => {
        console.log("Error downloading file.", err);
    })
        .pipe(dest);
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
        throw new Error("File not found");
    }
    const fileId = file.data.files[0].id;
    try {
        yield drive.files.delete({ fileId });
        console.log("File deleted successfully.");
    }
    catch (error) {
        console.log("Error deleting file:", error);
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
        throw new Error("File not found");
    }
    const fileId = file.data.files[0].webViewLink;
    return fileId;
});
exports.getDocumentPreviewLink = getDocumentPreviewLink;
//# sourceMappingURL=fileStorageHelpers.js.map