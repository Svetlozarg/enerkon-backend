import mongoose from "mongoose";

export interface DocumentModel {
  title: string;
  project: mongoose.Schema.Types.ObjectId;
  size: number;
  type: string;
  status: "In process" | "Canceled" | "Finished";
  default: boolean;
}

const documentSchema = new mongoose.Schema<DocumentModel>(
  {
    title: {
      type: String,
      required: [true, "Title field is required"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    size: {
      type: Number,
      required: [true, "Size field is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    status: {
      type: String,
      enum: ["In process", "Canceled", "Finished"],
      default: "In process",
    },
    default: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
