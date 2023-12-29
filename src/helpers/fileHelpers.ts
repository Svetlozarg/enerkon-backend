import path from "path";
import fs from "fs";
import xml2js from "xml2js";
import ExcelJS from "exceljs";

export const getFileName = (filePath: string) => {
  return path.basename(filePath);
};

export const getFileMimeType = (fileExtension: string) => {
  switch (fileExtension) {
    case "pdf":
      return "application/pdf";
    case "xml":
      return "application/xml";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "docs":
      return "application/vnd.google-apps.document";
    default:
      return "application/octet-stream";
  }
};
