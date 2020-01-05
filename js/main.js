// import './services/control.service.js';
// import renderService from './services/render.service.js'
// import canvasService  from "./services/cavas.service.js";
import './services/control.service.js';
import model from "./gameModel.js"

document.body.onload = init;

const boxWidth = 35;
const boxHeight = 35;
let gameInterval;
let gameSpeed = 500;

let canvas;
let ctx
function init() {
    canvas = document.querySelector('#board');
    ctx = canvas.getContext('2d');
    model.ctx = ctx;
    model.canvas = canvas;
    gameInterval = setInterval(() => {
        let isGameRunning = model.update();
        if (isGameRunning) model.render(model.board)
        else gameOver();

    }, gameSpeed);
}

function gameOver() {
    clearInterval(gameInterval);
    console.log('Game over!');
}