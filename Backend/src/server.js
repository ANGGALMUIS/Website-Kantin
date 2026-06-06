import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Room untuk kantin
  socket.on("join-canteen", (canteenId) => {
    console.log(`JOIN CANTEEN ROOM => canteen_${canteenId}`);
    socket.join(`canteen_${canteenId}`);

    console.log(`Socket ${socket.id} joined canteen_${canteenId}`);
  });

  // Room untuk buyer
  socket.on("join-buyer", (buyerId) => {
    console.log(`JOIN BUYER ROOM => buyer_${buyerId}`);
    socket.join(`buyer_${buyerId}`);

    console.log(`Socket ${socket.id} joined buyer_${buyerId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
