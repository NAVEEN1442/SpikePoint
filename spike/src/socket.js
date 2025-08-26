// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket;

if (!socket) {
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // ---- Logging ----
  socket.on("connect", () => {
    console.log("[Socket.IO] ✅ Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("[Socket.IO] ❌ Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket.IO] 🚨 Connection Error:", err.message);
  });

  socket.onAny((event, ...args) => {
    console.log(`[Socket.IO] 📡 Event: ${event}`, args);
  });
}

export { socket };
