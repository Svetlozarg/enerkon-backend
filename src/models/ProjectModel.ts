import mongoose from "mongoose";

export interface ProjectModel {
  title: string;
  documents: [
    {
      fileName: string;
      type: string;
      size: number;
    }
  ];
  favourite: boolean;
  status: "Paid" | "Unpaid";
  createdAt: Date;
  deletedAt: Date;
}

const projectSchema = new mongoose.Schema<ProjectModel>(
  {
    title: {
      type: String,
      required: [true, "Title field is required"],
    },
    documents: [
      {
        type: [Object],
        required: [true, "Documents field is required"],
      },
    ],
    favourite: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
