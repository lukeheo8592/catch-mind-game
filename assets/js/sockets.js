import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMessage } from "./chat";
import { handleBeganPath,handleFilled, handleClear, handleStrokedPath } from "./paint";
import { handlePlayerUpdate, handleGameStarted  } from "./players";
let socket = null;

export const getSocket = () => socket;


export const initSockets = aSocket => {
  const { events } = window;
  socket = aSocket;
  socket.on(events.newUser, handleNewUser);
  socket.on(events.disconnected, handleDisconnected);
  socket.on(events.newMsg, handleNewMessage);
  socket.on(events.beganPath, handleBeganPath);
  socket.on(events.strokedPath, handleStrokedPath);
  socket.on(events.filled, handleFilled);
  socket.on(events.playerUpdate, handlePlayerUpdate);
  socket.on(events.cleared, handleClear);
  socket.on(events.gameStarted, handleGameStarted);

};