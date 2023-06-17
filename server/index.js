import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/groups.js";
import postRoutes from "./routes/posts.js";
import profileRoutes from "./routes/profile.js";
import messageRoutes from "./routes/messages.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/posts", postRoutes);
app.use("/profile", profileRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING");
});

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

global.onlineUsers = new Map();
global.sockets = [];

// console.log(global);

io.on("connection", (socket) => {
  // console.log(socket);
  console.log("user connected");
  global.sockets.push(socket);
  socket.on("add-user", (userId) => {
    global.sockets.find((s) => s.id === socket.id).data.userId = userId;
    onlineUsers.set(userId, socket.id);
    // console.log(socket.id);
    console.log(global.sockets.map((s) => s.id));
    console.log(onlineUsers);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    global.onlineUsers.delete(global.sockets.find((s) => s.id === socket.id).data.userId);
    global.sockets = global.sockets.filter((s) => s.id !== socket.id);
    console.log(global.sockets.map((s) => s.id));
    console.log(onlineUsers);
  });
});
