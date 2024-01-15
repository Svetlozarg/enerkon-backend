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
exports.writeDataToExcel = exports.getExcelData = exports.convertXmlToObject = void 0;
const xml2js_1 = __importDefault(require("xml2js"));
const logger_1 = require("./logger");
const fileStorageHelpers_1 = require("./FileStorage/fileStorageHelpers");
const exceljs_1 = __importDefault(require("exceljs"));
const convertXmlToObject = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    if (!filename.endsWith(".xml")) {
        (0, logger_1.error)(`File ${filename} is not in XML format.`);
        throw new Error("Invalid file format. Only XML files are supported.");
    }
    const fileStream = yield (0, fileStorageHelpers_1.downloadFileFromDrive)(filename);
    return new Promise((resolve, reject) => {
        let data = "";
        fileStream.on("data", (chunk) => {
            data += chunk;
        });
        fileStream.on("end", () => {
            const parser = new xml2js_1.default.Parser({ explicitArray: false });
            parser.parseString(data, (err, result) => {
                if (err) {
                    (0, logger_1.error)("Error parsing XML file.");
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
        fileStream.on("error", (err) => {
            (0, logger_1.error)("Error reading XML file.");
            reject(err);
        });
    });
});
exports.convertXmlToObject = convertXmlToObject;
const getExcelData = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    if (!filename.endsWith(".xlsx")) {
        (0, logger_1.error)(`File ${filename} is not in XLSX format.`);
        throw new Error("Invalid file format. Only XLSX files are supported.");
    }
    const fileStream = yield (0, fileStorageHelpers_1.downloadFileFromDrive)(filename);
    const workbook = new exceljs_1.default.Workbook();
    yield workbook.xlsx.read(fileStream);
    const worksheet = workbook.getWorksheet("Word");
    const data = [];
    worksheet.eachRow((row) => {
        const rowData = row.values.slice(1);
        data.push(rowData);
    });
    return data;
});
exports.getExcelData = getExcelData;
const writeDataToExcel = (templateFileName, outputFileName, excelData) => __awaiter(void 0, void 0, void 0, function* () {
    const fileStream = yield (0, fileStorageHelpers_1.downloadFileFromDrive)(templateFileName);
    const workbook = new exceljs_1.default.Workbook();
    yield workbook.xlsx.read(fileStream);
    Object.keys(excelData).forEach((sheetName) => {
        const sheet = workbook.getWorksheet(sheetName);
        excelData[sheetName].forEach((cellValue) => {
            sheet.getCell(cellValue.cell).value = cellValue.value;
        });
    });
    const buffer = yield workbook.xlsx.writeBuffer();
    yield (0, fileStorageHelpers_1.uploadFileToGoogleDrive)(outputFileName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer);
});
exports.writeDataToExcel = writeDataToExcel;
//# sourceMappingURL=fileHelpers.js.map