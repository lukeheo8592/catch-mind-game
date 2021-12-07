import { getSocket } from "./sockets";

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const mode = document.getElementById("jsMode");
const clear = document.getElementById("jsClear");
const range = document.getElementById("jsRange");
const currentColor = document.getElementById("jsCurrentColor");
const controls = document.getElementById("jsControls");


const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

const init = () => {
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

const stopPainting = () => {
  painting = false;
}

const startPainting = () => {
  painting = true;
}

const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  getSocket().emit(window.events.clear);
}

const strokePath = (x, y, color = null, lineWidth) => {
  let currentColor = ctx.strokeStyle;
  let currentLine = ctx.lineWidth;
  if (color !== null) {
    ctx.strokeStyle = color;
  }
  if (lineWidth !== null) {
    ctx.lineWidth = lineWidth;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentLine;
};

const onMouseMove = event => {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    beginPath(x, y);
    getSocket().emit(window.events.beginPath, { x, y });
  } else if(!filling) {
    strokePath(x, y);
    getSocket().emit(window.events.strokePath, {
      x,
      y,
      color: ctx.strokeStyle,
      lineWidth: ctx.lineWidth
    });
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

const fill = (color = null) => {
  let currentColor = ctx.fillStyle;
  if (color !== null) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = currentColor;
};


function handleCanvasClick() {
  if (filling) {
    fill();
    getSocket().emit(window.events.fill, { color: ctx.fillStyle });
  }
}


function handleCM(event) {
  event.preventDefault();
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
  const currentColor = document.querySelector("#jsCurrentColor");
  currentColor.style.backgroundColor = "#000000";
  canvas.width = canvaswidth.offsetWidth;
};
window.addEventListener('resize', windowResize);

setTimeout(init, 10);
export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y, color, lineWidth }) => strokePath(x, y, color, lineWidth);
export const handleFilled = ({ color }) => fill(color);
export const handleClear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleCanvasClick);
};

export const enableCanvas = () => {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
};

export const hideControls = () => (controls.style.opacity = 0);

export const showControls = () => (controls.style.opacity = 1);

if (canvas) {
  enableCanvas();
  canvas.addEventListener("contextmenu", handleCM);
  clear.addEventListener("click", clearCanvas);
}