import xml2js from "xml2js";
import { error } from "./logger";
import {
  downloadFileFromDrive,
  uploadFileToGoogleDrive,
} from "./FileStorage/fileStorageHelpers";
import ExcelJS from "exceljs";

export type CellValue = {
  cell: string;
  value: string;
};

export type SheetData = {
  [sheetName: string]: CellValue[];
};

export const convertXmlToObject = async (filename: string) => {
  if (!filename.endsWith(".xml")) {
    error(`File ${filename} is not in XML format.`);
    throw new Error("Invalid file format. Only XML files are supported.");
  }

  const fileStream = await downloadFileFromDrive(filename);

  return new Promise((resolve, reject) => {
    let data = "";
    fileStream.on("data", (chunk) => {
      data += chunk;
    });

    fileStream.on("end", () => {
      const parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(data, (err, result) => {
        if (err) {
          error("Error parsing XML file.");
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    fileStream.on("error", (err) => {
      error("Error reading XML file.");
      reject(err);
    });
  });
};

export const getExcelData = async (filename: string) => {
  if (!filename.endsWith(".xlsx")) {
    error(`File ${filename} is not in XLSX format.`);
    throw new Error("Invalid file format. Only XLSX files are supported.");
  }

  const fileStream = await downloadFileFromDrive(filename);

  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.read(fileStream);

  const worksheet = workbook.getWorksheet("Word");

  const data: any = [];

  worksheet.eachRow((row: any) => {
    const rowData = row.values.slice(1);
    data.push(rowData);
  });

  return data;
};

export const writeDataToExcel = async (
  templateFileName: string,
  outputFileName: string,
  excelData: SheetData
) => {
  const fileStream = await downloadFileFromDrive(templateFileName);

  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.read(fileStream);

  Object.keys(excelData).forEach((sheetName) => {
    const sheet = workbook.getWorksheet(sheetName);

    excelData[sheetName].forEach((cellValue) => {
      sheet.getCell(cellValue.cell).value = cellValue.value;
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  await uploadFileToGoogleDrive(
    outputFileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer
  );
};
