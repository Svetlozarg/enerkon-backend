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
const createKCCDocument = (projectName, projectId, owner) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.warning)("Creating KCC document...");
    const xmlData = (yield (0, fileHelpers_1.convertXmlToObject)(projectName + "-Project.xml"));
    if (xmlData) {
        (0, logger_1.warning)("XML data retrieved successfully.");
        const kkcExcelData = {
            Лист1: [
                { cell: "A1:E1", value: xmlData.CalculationInput.General.ProjectName },
                {
                    cell: "D3",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .ZoneAreaElements.TotalOuterWalls.Actual,
                },
                {
                    cell: "D4",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .ZoneAreaElements.TotalRoofElements.Actual,
                },
                {
                    cell: "D5",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .ZoneAreaElements.TotalFloorElements.Actual,
                },
                {
                    cell: "D6",
                    value: xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
                        .ZoneAreaElements.TotalWindows.Actual,
                },
            ],
        };
        (0, logger_1.warning)("KCC Excel data prepared.");
        const currentData = (0, constants_1.getCurrentData)();
        yield (0, fileHelpers_1.writeDataToExcel)("kcc.xlsx", `КСС_${projectName}_${currentData}.xlsx`, kkcExcelData);
        const newDocument = new document_model_1.default({
            title: `КСС_${projectName}_${currentData}.xlsx`,
            owner: owner,
            project: projectId,
            size: 0.1,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const createdDocument = yield newDocument.save();
        (0, logHelpers_1.updateProjectLog)(new mongoose_1.Types.ObjectId(projectId), createdDocument.title, "Файлът е създаден", createdDocument.updatedAt);
        if (createdDocument) {
            (0, logger_1.info)("KCC document created successfully.");
            return createdDocument;
        }
    }
    else {
        (0, logger_1.error)("Failed to retrieve XML data.");
    }
});
exports.createKCCDocument = createKCCDocument;
//# sourceMappingURL=createKCCDocument.js.map