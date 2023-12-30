import { Document as MongooseDocument, Schema, model, models } from "mongoose";

export interface IDocument extends MongooseDocument {
  _id: string;
  title: string;
  owner: string;
  project: string;
  size: number;
  type: string;
  status: "In process" | "Canceled" | "Finished";
  default: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema(
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
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
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

const Document =
  models.Document || model<IDocument>("Document", documentSchema);

export default Document;
