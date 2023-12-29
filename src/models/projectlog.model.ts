import { Document, Schema, model, models } from "mongoose";

export interface IProjectLog extends Document {
  _id: string;
  project: string;
  log: [
    {
      title: string;
      action: string;
      date: Date;
    }
  ];
}

const projectLogSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  log: [
    {
      title: {
        type: String,
        required: true,
      },
      action: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const ProjectLog =
  models.ProjectLog || model<IProjectLog>("ProjectLog", projectLogSchema);

export default ProjectLog;
