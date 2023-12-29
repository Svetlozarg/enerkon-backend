import { Document, Schema, model, models } from "mongoose";

export interface IProject extends Document {
  _id: string;
  title: string;
  owner: string;
  favourite: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;
