'use strict'

const INIT_DIAMETER = 100;
const BALLS_AMOUNT = 6;
const INIT_COLORS = ['orange', 'purple', 'green', 'red', 'skyblue', 'pink'];
const MIN_DIFF_DIA = 20, MAX_DIFF_DIA = 60;

var balls;

function onInit() {
    balls = createBalls(BALLS_AMOUNT, INIT_DIAMETER, INIT_COLORS);
    renderBalls(balls);
    changeBodyBgColor('black');
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
    for (const ball of balls) {
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
    const ball1 = balls[0], ball2 = balls[1];
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
