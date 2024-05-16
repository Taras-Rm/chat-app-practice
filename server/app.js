import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected ", socket.id);

  socket.on("message", () => {
    
  })

  socket.on("disconnect", () => {
    console.log("Disconnected ", socket.id);
  });
});

export default server;
