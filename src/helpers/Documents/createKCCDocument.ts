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
  projectName: string,
  projectId: string,
  owner: string
) => {
  warning("Creating KCC document...");

  const xmlData: ProjectXML = (await convertXmlToObject(
    projectName + "-Project.xml"
  )) as ProjectXML;

  if (xmlData) {
    warning("XML data retrieved successfully.");

    const kkcExcelData: SheetData = {
      Лист1: [
        { cell: "A1:E1", value: xmlData.CalculationInput.General.ProjectName },
        {
          cell: "D3",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .ZoneAreaElements.TotalOuterWalls.Actual,
        },
        {
          cell: "D4",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .ZoneAreaElements.TotalRoofElements.Actual,
        },
        {
          cell: "D5",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .ZoneAreaElements.TotalFloorElements.Actual,
        },
        {
          cell: "D6",
          value:
            xmlData.CalculationInput.BuildingZones.BuildingZone.Heating.Area
              .ZoneAreaElements.TotalWindows.Actual,
        },
      ],
    };

    warning("KCC Excel data prepared.");

    const currentData = getCurrentData();

    await writeDataToExcel(
      "kcc.xlsx",
      `КСС_${projectName}_${currentData}.xlsx`,
      kkcExcelData
    );

    const newDocument = new Document({
      title: `КСС_${projectName}_${currentData}.xlsx`,
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

    info("KCC document created successfully.");
  } else {
    error("Failed to retrieve XML data.");
  }
};
