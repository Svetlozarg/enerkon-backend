import { Types } from "mongoose";
import ProjectLog from "../models/projectlog.model";
import { error } from "./logger";

export const updateProjectLog = async (
  project: Types.ObjectId,
  title: string,
  action: string,
  date: Date
) => {
  try {
    let projectLog = await ProjectLog.findOne({ project });

    if (!projectLog) {
      projectLog = new ProjectLog({
        project,
        log: [{ title, action, date }],
      });
    } else {
      projectLog.log.push({ title, action, date });
    }

    const updatedProjectLog = await projectLog.save();

    if (!updatedProjectLog) {
      error(`Project log could not be created`);
      throw new Error("Project log not created");
    }
  } catch (err) {
    error(`Project log could not be created`);
    throw new Error("Project log not created");
  }
};

export const deleteProjectLog = async (project: Types.ObjectId) => {
  try {
    const deletedProjectLog = await ProjectLog.findOneAndDelete({ project });

    if (!deletedProjectLog) {
      error(`Project log with the given project id not found `);
      throw new Error("Project log not found");
    }
  } catch (err) {
    error(`Project log could not be deleted`);
    throw new Error("Project log not deleted");
  }
};
