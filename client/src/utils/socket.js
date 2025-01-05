import { io } from "socket.io-client";

const socket = io("https://chat-room-app-tnj8.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
