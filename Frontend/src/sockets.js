import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});

export default socket;
