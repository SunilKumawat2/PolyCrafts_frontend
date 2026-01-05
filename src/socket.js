import { io } from "socket.io-client";

export const socket = io("https://bvmwebsolutions.com/polycraft/backend", {
  transports: ["websocket"],
});
