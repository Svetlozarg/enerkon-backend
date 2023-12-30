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
exports.createKCCDocument = void 0;
const mongoose_1 = require("mongoose");
const fileHelpers_1 = require("../fileHelpers");
const logHelpers_1 = require("../logHelpers");
const logger_1 = require("../logger");
const document_model_1 = __importDefault(require("../../models/document.model"));
const constants_1 = require("../constants");
const createKCCDocument = (xmlDocumentName, projectName, projectId, owner) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.warning)("Creating Resume document...");
    const xmlData = (yield (0, fileHelpers_1.convertXmlToObject)(xmlDocumentName));
    if (xmlData) {
        (0, logger_1.warning)("XML data retrieved successfully.");
        const resumeExcelData = {
            Contacts: [
                { cell: "C11", value: "" },
                { cell: "C18", value: "" },
                { cell: "C19", value: "" },
                { cell: "C20", value: "" },
                { cell: "C21", value: "" },
                { cell: "D21", value: "" },
                { cell: "C22", value: "" },
                { cell: "C23", value: "" },
                { cell: "D23", value: "" },
                { cell: "C24", value: "" },
                { cell: "D24", value: "" },
                { cell: "C25", value: "" },
                { cell: "C26", value: "" },
                { cell: "C27", value: "" },
                { cell: "C28", value: "" },
                { cell: "C29", value: "" },
                {
                    cell: "C30",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .HeatedArea,
                },
                {
                    cell: "C31",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .HeatedVolume,
                },
                { cell: "C32", value: "" },
                { cell: "C33", value: "" },
                {
                    cell: "C34",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .HeatedArea,
                },
                {
                    cell: "C35",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .HeatedVolume,
                },
                { cell: "C36", value: "" },
                { cell: "D36", value: "" },
                { cell: "C37", value: "" },
                { cell: "C38", value: "" },
                { cell: "D38", value: "" },
                { cell: "C39", value: "" },
                { cell: "C40", value: "" },
                { cell: "C41", value: "" },
                { cell: "C42", value: "" },
                { cell: "C43", value: "" },
                { cell: "C47", value: "" },
                { cell: "C48", value: "" },
                { cell: "C49", value: "" },
                { cell: "C50", value: "" },
                { cell: "C51", value: "" },
                { cell: "C52", value: "" },
                { cell: "C53", value: "" },
                { cell: "C54", value: "" },
                { cell: "C55", value: "" },
            ],
            BuildingDescription: [],
        };
        (0, logger_1.warning)("Resume Excel data prepared.");
        const currentData = (0, constants_1.getCurrentData)();
        yield (0, fileHelpers_1.writeDataToExcel)("resume.xlsx", `Resume_Certificatе_${projectName}_${currentData}.xlsx`, resumeExcelData);
        const newDocument = new document_model_1.default({
            title: `Resume_Certificatе_${projectName}_${currentData}.xlsx`,
            owner: owner,
            project: projectId,
            size: 0.1,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const createdDocument = yield newDocument.save();
        (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(projectId), createdDocument.title, "Файлът е създаден", createdDocument.updatedAt);
        (0, logger_1.info)("Resume document created successfully.");
    }
    else {
        (0, logger_1.error)("Failed to retrieve XML data.");
    }
});
exports.createKCCDocument = createKCCDocument;
//# sourceMappingURL=createResumeDocument.js.map