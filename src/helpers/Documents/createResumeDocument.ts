import { Types } from "mongoose";
import {
  SheetData,
  convertXmlToObject,
  writeDataToExcel,
} from "../fileHelpers";
import { updateProjectLog } from "../logHelpers";
import { error, info, warning } from "../logger";
import { ProjectXML } from "./xmlTypes";
import Document from "../../models/document.model";
import { getCurrentData } from "../constants";

export const createKCCDocument = async (
  xmlDocumentName: string,
  projectName: string,
  projectId: string,
  owner: string
) => {
  warning("Creating Resume document...");

  const xmlData: ProjectXML = (await convertXmlToObject(
    xmlDocumentName
  )) as ProjectXML;

  if (xmlData) {
    warning("XML data retrieved successfully.");

    const resumeExcelData: SheetData = {
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
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .HeatedArea,
        },
        {
          cell: "C31",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .HeatedVolume,
        },
        { cell: "C32", value: "" },
        { cell: "C33", value: "" },
        {
          cell: "C34",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .HeatedArea,
        },
        {
          cell: "C35",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
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

    warning("Resume Excel data prepared.");

    const currentData = getCurrentData();

    await writeDataToExcel(
      "resume.xlsx",
      `Resume_Certificatе_${projectName}_${currentData}.xlsx`,
      resumeExcelData
    );

    const newDocument = new Document({
      title: `Resume_Certificatе_${projectName}_${currentData}.xlsx`,
      owner: owner,
      project: projectId,
      size: 0.1,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const createdDocument = await newDocument.save();

    updateProjectLog(
      new Types.ObjectId(projectId),
      createdDocument.title,
      "Файлът е създаден",
      createdDocument.updatedAt
    );

    info("Resume document created successfully.");
  } else {
    error("Failed to retrieve XML data.");
  }
};
