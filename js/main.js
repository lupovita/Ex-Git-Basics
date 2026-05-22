'use strict'

const INIT_DIAMETER = 100;
const BALLS_AMOUNT = 6;
const INIT_COLORS = ['orange', 'purple', 'green', 'red', 'skyblue', 'pink'];
const MIN_DIFF_DIA = 20, MAX_DIFF_DIA = 60;
const HOVER_TIME_LIMIT = 2000;
const CYCLES_NUM = 10;
const HANDLERS_INTERVAL = 2000;
const TIMER_INTERVAL = 500;

var gHoverHandler;
var gBalls;

function onInit() {
    resetHoverHandler();
    gBalls = createBalls(BALLS_AMOUNT, INIT_DIAMETER, INIT_COLORS);
    renderBalls(gBalls);
    changeBodyBgColor('black');
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

function onBallClick(elBall, maxDiameter) {
    const diameterDiff = getRandomInt(MIN_DIFF_DIA, MAX_DIFF_DIA);
    changeBallDiameter(elBall, maxDiameter, diameterDiff);
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
}

function onReduceDiameter() {
    const elBalls = document.querySelectorAll('.ball');
    let diameterDiff = -getRandomInt(MIN_DIFF_DIA, MAX_DIFF_DIA);
    changeBallDiameter(elBalls[0], undefined, diameterDiff);

    diameterDiff = -getRandomInt(MIN_DIFF_DIA, MAX_DIFF_DIA);
    changeBallDiameter(elBalls[1], undefined, diameterDiff);
}

function onChangeBgColor() {
    changeBodyBgColor(getRandomColor());
}

function changeBodyBgColor(bgColor) {
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
