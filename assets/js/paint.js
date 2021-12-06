import { getSocket } from "./sockets";

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const mode = document.getElementById("jsMode");
const clear = document.getElementById("jsClear");
const range = document.getElementById("jsRange");
const currentColor = document.getElementById("jsCurrentColor");


const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

function init(){
  const canvaswidth = document.getElementById("canvaswidth").offsetWidth;
  canvas.width = canvaswidth;
  canvas.height = CANVAS_SIZE;
  
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, CANVAS_SIZE);
  ctx.strokeStyle = INITIAL_COLOR;
  ctx.fillStyle = INITIAL_COLOR;
  ctx.lineWidth = 2.5;
  
}


let painting = false;
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

function clearCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  getSocket().emit(window.events.clear);
}

const strokePath = (x, y) => {
  ctx.lineTo(x, y);
  ctx.stroke();
};

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    beginPath(x, y);
    getSocket().emit(window.events.beginPath, { x, y });
  } else {
    strokePath(x, y);
    getSocket().emit(window.events.strokePath, { x, y });
  }
}

function handleRangeChange(event){
  const lineSize = event.target.value;
  ctx.lineWidth = lineSize;
  }

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  currentColor.style.backgroundColor = color;
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, canvas.width, CANVAS_SIZE);
  }
}


function handleCM(event) {
  event.preventDefault();
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
  clear.addEventListener("click", clearCanvas);
}

Array.from(colors).forEach(color =>
  color.addEventListener("click", handleColorClick)
);

if (mode) {
  mode.addEventListener("click", handleModeClick);
}
if(range){
  range.addEventListener("input", handleRangeChange);
}
function windowResize() {
  canvas.width = canvaswidth.offsetWidth;
};
window.addEventListener('resize', windowResize);

setTimeout(init, 10);
export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y }) => strokePath(x, y);
export const handleClear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);