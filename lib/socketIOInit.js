import { io } from "socket.io-client";

let socket;

const initSocket = () => {
  return io("http://localhost:3000");
};

export { initSocket };
