import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
console.log("SERVE", server);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when connect
  console.log("New client connected");
  //   take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User added to the system:", userId);
    io.emit("getUsers", users);
  });

  //   send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(user);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //   when disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

export { io, app, server };
