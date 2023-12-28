import mongoose from "mongoose";

export interface UserModel {
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserModel>(
  {
    username: {
      type: String,
      required: [true, "Username field is required"],
    },
    email: {
      type: String,
      required: [true, "Email address field is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
