import { config } from "dotenv";
config();
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

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
// app.use("/api/project", require("./routes/projectRoutes"));
// app.use("/api/document", require("./routes/documentRoutes"));
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "404 Not Found" });
});

mongoose
  .connect(process.env.MONGO_CONNECTION_URL!)
  .then((connect) => {
    console.log(
      "\x1b[92m%s\x1b[0m",
      `Server successfully started and running on port ${PORT}`
    );
    console.log(
      "\x1b[92m%s\x1b[0m",
      "Database connected: ",
      "Host: " + connect.connection.host,
      "DB Name: " + connect.connection.name
    );
    app.listen(PORT);
  })
  .catch((error) => {
    console.log("Error: ", error.message);
    process.exit(1);
  });
