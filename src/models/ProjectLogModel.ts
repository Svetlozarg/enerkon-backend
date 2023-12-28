import mongoose from "mongoose";

export interface ProjectLogModel {
  project: mongoose.Schema.Types.ObjectId;
  log: [
    {
      title: string;
      action: string;
      date: Date;
    }
  ];
}

const projectLogSchema = new mongoose.Schema<ProjectLogModel>({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Project ID is required"],
  },
  log: [
    {
      title: {
        type: String,
        required: [true, "Title field is required"],
      },
      action: {
        type: String,
        required: [true, "Action field is required"],
      },
      date: {
        type: Date,
        required: [true, "Date field is required"],
      },
    },
  ],
});

export default mongoose.model("ProjectLog", projectLogSchema);
