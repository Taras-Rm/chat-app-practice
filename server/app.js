import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT,
  },
});

io.on("connection", (socket) => {
  // send all connections for new connections
  socket.emit("connectedUsers", getConnetctionsIds());

  // send to all connections new connection
  socket.broadcast.emit("userConnected", socket.id);

  // waiting for message from connection
  socket.on("sendMessage", (text) => {
    // send message to all connections
    io.emit("message", { text, userId: socket.id });
  });

  // checking connect error
  socket.on("connet_error", (error) => {
    console.log("Erorr during connection: ", error.message);
  });

  socket.on("disconnect", () => {
    // send to all clients disconnectes connection
    socket.broadcast.emit("userDisconnected", socket.id);
  });
});

const getConnetctionsIds = () => {
  const ids = [];

  for (let [id, _] of io.sockets.sockets) {
    ids.push(id);
  }

  return ids;
};

export default server;
