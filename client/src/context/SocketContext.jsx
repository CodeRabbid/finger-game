import React, { createContext } from "react";
import { io, Socket } from "socket.io-client";

const socket = io("", {
  path: "/api/socket.io",
  autoConnect: false,
});
const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };
