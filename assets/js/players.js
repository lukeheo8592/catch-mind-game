import { disableCanvas, hideControls } from "./paint";

const board = document.getElementById("jsPBoard");

const addPlayers = players => {
  board.innerHTML = "";
  players.forEach(player => {
    const playerElement = document.createElement("span");
    board.appendChild(playerElement);
    playerElement.innerText = `${player.nickname}: ${player.points}`;
  });
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
export const handleGameStarted = () => {
    disableCanvas();
    hideControls();
  };