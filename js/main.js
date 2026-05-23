'use strict'

const INIT_DIAMETER = 100;
const BALLS_AMOUNT = 6;
const INIT_COLORS = ['orange', 'purple', 'green', 'red', 'skyblue', 'pink'];
const MIN_DIFF_DIA = 20, MAX_DIFF_DIA = 60;
const HOVER_TIME_LIMIT = 2000;
const CYCLES_NUM = 10;
const HANDLERS_INTERVAL = 2000;
const TIMER_INTERVAL = 500;
const SECOND = 1000, MINUTE = 60;

var gHoverHandler;
var gBalls;
var gBgColor;
var gGame;

function onInit() {
    resetHoverHandler();
    gBalls = createBalls(BALLS_AMOUNT, INIT_DIAMETER, INIT_COLORS);
    updateBodyBgColor('black');
    resetGame();
    updateGameStates(true);
    renderBalls(gBalls);
    renderMoves();
    handleBtnsActiveState();
    updateTimer();
}

function resetHoverHandler() {
    if (gHoverHandler && gHoverHandler.isHover) {
        clearInterval(gHoverHandler.handlersIntervalId);
        clearInterval(gHoverHandler.timerIntervalId);
    }
    gHoverHandler = {
        startTime: null,
        handlersIntervalId: null,
        timerIntervalId: null,
        cycles: 0,
        isHover: false
    };
}

function resetGame() {
    if (gGame && gGame.startTime) clearInterval(gGame.timerIntervalId);
    gGame = {
        states: [],
        idx: -1,
        startTime: null,
        timerIntervalId: null
    };
}

function onBallClick(elBall, maxDiameter) {
    const diameterDiff = getRandomInt(MIN_DIFF_DIA, MAX_DIFF_DIA);
    changeBallDiameter(elBall, maxDiameter, diameterDiff);
    updateGameStates(true);
}

function changeBallDiameter(elBall, maxDiameter, diameterDiff) {
    // Model
    const ball = getBallModelByElement(elBall);
    ball.diameter += diameterDiff;
    if (ball.diameter > maxDiameter || ball.diameter < INIT_DIAMETER) ball.diameter = INIT_DIAMETER;
    ball.bgColor = getRandomColor();
    // Dom
    elBall.style.width = `${ball.diameter}px`;
    elBall.innerText = ball.diameter;
    elBall.style.backgroundColor = ball.bgColor;
}

function getBallModelByElement(elBall) {
    for (const ball of gBalls) {
        if (elBall.classList.contains(ball.className)) return ball;
    }
    return null;
}

function createBalls(ballsAmount, diameter, colors) {
    const balls = [];
    for (let i = 0; i < ballsAmount; i++) {
        const ball = {
            className: `ball${i + 1}`,
            diameter: diameter,
            bgColor: colors[i]
        };
        balls.push(ball);
    }
    return balls;
}

function copyBalls(balls) {
    const ballsCopy = [];
    for (const ball of balls) {
        const ballCopy = {
            className: ball.className,
            diameter: ball.diameter,
            bgColor: ball.bgColor
        };
        ballsCopy.push(ballCopy);
    }
    return ballsCopy;
}

function renderBalls(balls) {
    const elBalls = document.querySelectorAll('.ball');
    for (let i = 0; i < elBalls.length; i++) {
        const ball = balls[i];
        const elBall = elBalls[i];
        elBall.style.width = `${ball.diameter}px`;
        elBall.style.backgroundColor = ball.bgColor;
        if (i < 2) elBall.innerText = ball.diameter;
    }
}

function renderMoves() {
    const elTotalMoves = document.querySelector('.total-moves');
    elTotalMoves.innerText = gGame.states.length - 1;
    const elCurrMove = document.querySelector('.current-move');
    elCurrMove.innerText = gGame.idx;
}

function onSwap() {
    const elBalls = document.querySelectorAll('.ball');
    const elBall1 = elBalls[0], elBall2 = elBalls[1];
    const ball1 = gBalls[0], ball2 = gBalls[1];
    // Model
    const tempColor = ball1.bgColor;
    ball1.bgColor = ball2.bgColor;
    ball2.bgColor = tempColor;
    // Dom
    elBall1.style.backgroundColor = ball1.bgColor;
    elBall2.style.backgroundColor = ball2.bgColor;

    updateGameStates(true);
}

function onReduceDiameter() {
    const elBalls = document.querySelectorAll('.ball');
    let diameterDiff = -getRandomInt(MIN_DIFF_DIA, MAX_DIFF_DIA);
    changeBallDiameter(elBalls[0], undefined, diameterDiff);

    diameterDiff = -getRandomInt(MIN_DIFF_DIA, MAX_DIFF_DIA);
    changeBallDiameter(elBalls[1], undefined, diameterDiff);

    updateGameStates(true);
}

function onChangeBgColor() {
    updateBodyBgColor(getRandomColor());
    updateGameStates(true);
}

function updateBodyBgColor(bgColor) {
    gBgColor = bgColor;
    document.body.style.backgroundColor = bgColor;
}

function onBallEnter() {
    gHoverHandler.startTime = Date.now();
    gHoverHandler.isHover = true;
    gHoverHandler.timerIntervalId = setInterval(hoverTimer, TIMER_INTERVAL);
}

function hoverTimer() {
    const hoverTime = Date.now() - gHoverHandler.startTime;
    if (hoverTime > HOVER_TIME_LIMIT) {
        gHoverHandler.handlersIntervalId = setInterval(runClickHandlers, HANDLERS_INTERVAL);
        clearInterval(gHoverHandler.timerIntervalId);
    }
}

function runClickHandlers() {
    const elBalls = document.querySelectorAll('.ball');
    onBallClick(elBalls[0], 400);
    onBallClick(elBalls[1], 250);
    onSwap();
    onReduceDiameter();

    gHoverHandler.cycles++;
    if (gHoverHandler.cycles >= CYCLES_NUM) resetHoverHandler();
}

function onBallLeave() {
    resetHoverHandler();
}

function onUndo(elBtn) {
    updateGameStates(false, -1);
}

function onRedo(elBtn) {
    updateGameStates(false, 1);
}

function updateGameStates(isMove, step = null) {
    if (!isMove) {
        if (gGame.idx + step < 0 || gGame.idx + step >= gGame.states.length) return;

        gGame.idx += step;
        const currGameState = gGame.states[gGame.idx];
        gBalls = copyBalls(currGameState.balls);
        gBgColor = currGameState.bgColor;
        renderBalls(gBalls);
        updateBodyBgColor(gBgColor);
    }
    else {
        if (!gGame.startTime && gGame.idx >= 0) {
            gGame.startTime = Date.now();
            gGame.timerIntervalId = setInterval(updateTimer, TIMER_INTERVAL);
        }
        gGame.idx++;
        const currGameState = { balls: copyBalls(gBalls), bgColor: gBgColor };
        gGame.states.splice(gGame.idx, Infinity, currGameState);
    }
    renderMoves();
    handleBtnsActiveState();
}

function handleBtnsActiveState() {
    const elBtns = document.querySelectorAll('button');
    const elBtnUndo = elBtns[0], elBtnRedo = elBtns[1];
    elBtnUndo.disabled = gGame.idx > 0 ? false : true;
    elBtnRedo.disabled = gGame.idx < gGame.states.length - 1 ? false : true;
}

function updateTimer() {
    const elTime = document.querySelector('.time');
    if (gGame.startTime) {
        const timeInSec = parseInt((Date.now() - gGame.startTime) / SECOND);
        let seconds = timeInSec % MINUTE;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        let minutes = parseInt(timeInSec / MINUTE);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        elTime.innerText = `${minutes}:${seconds}`;
    }
    else {
        elTime.innerText = '00:00';
    }
}