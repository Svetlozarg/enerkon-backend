import { google } from "googleapis";
import fs from "fs";
import { getFileMimeType, getFileName } from "../fileHelpers";

const SCOPE = ["https://www.googleapis.com/auth/drive"];

const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
};

const uploadFile = (authClient: any, filePath: string) => {
  return new Promise((resolve, rejected) => {
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileExtension = filePath.split(".").pop();
    const mimeType = getFileMimeType(fileExtension);

    const fileMetaData = {
      name: getFileName(filePath),
      parents: ["1DeaVaoSLAR9n6R5UdhKi0VURCQVSPeC4"],
    };

    drive.files.create(
      {
        requestBody: fileMetaData,
        media: {
          body: fs.createReadStream(filePath),
          mimeType: mimeType,
        },
        fields: "id",
      },
      function (error: any, file: any) {
        if (error) {
          return rejected(error);
        }
        resolve(file);
      }
    );
  });
};

export const uploadFileToDrive = async (filePath: string) => {
  try {
    const authClient = await authorize();

    const file = await uploadFile(authClient, filePath);

    if (!file) {
      throw new Error("Error while uploading file");
    } else {
      console.log("%cFile uploaded successfully", "background-color: green");
    }
  } catch (error) {
    console.log(error);
  }
};

export const downloadFileFromDrive = async (fileName: string) => {
  const authClient = await authorize();
  const drive = google.drive({ version: "v3", auth: authClient });

  const file = await drive.files.list({
    q: `name='${fileName}'`,
    fields: "files(id)",
  });

  if (file.data.files.length === 0) {
    throw new Error("File not found");
  }

  const fileId = file.data.files[0].id;

  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  const dest = fs.createWriteStream(`./uploads/${fileName}`);
  response.data
    .on("end", () => {
      console.log("Done downloading file.");
    })
    .on("error", (err) => {
      console.log("Error downloading file.", err);
    })
    .pipe(dest);
};

export const deleteFileFromDrive = async (fileName: string) => {
  const authClient = await authorize();
  const drive = google.drive({ version: "v3", auth: authClient });

  const file = await drive.files.list({
    q: `name='${fileName}'`,
    fields: "files(id)",
  });

  if (file.data.files.length === 0) {
    throw new Error("File not found");
  }

  const fileId = file.data.files[0].id;

  try {
    await drive.files.delete({ fileId });
    console.log("File deleted successfully.");
  } catch (error) {
    console.log("Error deleting file:", error);
  }
};

export const getDocumentPreviewLink = async (fileName: string) => {
  const authClient = await authorize();
  const drive = google.drive({ version: "v3", auth: authClient });

  const file = await drive.files.list({
    q: `name='${fileName}'`,
    fields: "files(webViewLink)",
  });

  if (file.data.files.length === 0) {
    throw new Error("File not found");
  }

  const fileId = file.data.files[0].webViewLink;

  return fileId;
};
