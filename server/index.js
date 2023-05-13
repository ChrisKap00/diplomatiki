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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// console.log(io);

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
    // console.log("user " + onlineUsers.get(socket.id) + " disconnected");
    console.log("user disconnected");
    global.onlineUsers.delete(
      global.sockets.find((s) => s.id === socket.id).data.userId
    );
    global.sockets = global.sockets.filter((s) => s.id !== socket.id);
    console.log(global.sockets.map((s) => s.id));
    console.log(onlineUsers);
  });
  // socket.on("send-msg", (message) => {
  //   console.log("message: ");
  //   console.log(message);
  //   const receiverSocket = onlineUsers.get(message.receiverId);
  //   console.log("receiverSocket: ");
  //   console.log(receiverSocket);
  //   if (receiverSocket) {
  //     console.log(`SENDING receive-msg to ${receiverSocket}`);
  //     socket.to(receiverSocket).emit("receive-msg", message);
  //   }
  //   console.log(onlineUsers);
  // });
});
