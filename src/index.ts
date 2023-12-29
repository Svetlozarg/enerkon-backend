import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import documentRoutes from "./routes/documentRoutes";
import { success } from "./helpers/logger";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/document", documentRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "404 Not Found" });
});

mongoose
  .connect(process.env.MONGO_CONNECTION_URL!)
  .then((connect) => {
    success(`Server successfully started and running on port ${PORT}`);
    success(
      `Database successfully connected => Host: ${connect.connection.host} / DB Name: ${connect.connection.name}`
    );
    app.listen(PORT);
  })
  .catch((error) => {
    console.log("Error: ", error.message);
    process.exit(1);
  });
