import { getSocket } from "./sockets";


const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

const count = document.getElementById("count");
let downloadTimer;
const appendMsg = (text, nickname) => {
  const li = document.createElement("li");
  li.innerHTML = `
        <span class="author ${nickname ? "out" : "self"}">${
    nickname ? nickname : "You"
  }:</span> ${text}
    `;
  messages.appendChild(li);
};

const handleSendMsg = event => {
  event.preventDefault();
  const input = sendMsg.querySelector("input");
  const { value } = input;
  getSocket().emit(window.events.sendMsg, { message: value });
  input.value = "";
  appendMsg(value);
};





const tick = () => {
  let timeleft = 30;
   downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    count.innerText = "Time out!!";
  }
  timeleft -= 1;
  count.innerText = `${timeleft}s remaining`;
}, 1000);
}
export const handleNewMessage = ({ message, nickname }) =>
  appendMsg(message, nickname);

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

export const disableChat = () => (sendMsg.style.display = "none");
export const enableChat = () => (sendMsg.style.display = "flex");
export const setTime = () => {
  tick();
}
export const resetTime = () => {
  console.log("rererere");
  clearInterval(downloadTimer);
  for(let i=0; i<100; i++)
{
    window.clearInterval(i);
}
  count.innerText = "Time is out !!";

}