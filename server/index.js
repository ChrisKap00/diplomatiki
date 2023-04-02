import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/groups.js";
import postRoutes from "./routes/posts.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/posts", postRoutes);

const PORT = 5000;

mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://diplomatiki:JzKQhAFUkYxp6q5r@cluster0.doynqwj.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// .catch((error) => console.log(error.message));
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
