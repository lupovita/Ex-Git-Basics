'use strict'

const balls = [
    {diameter: 100, className: 'ball1'},
    {diameter: 100, className: 'ball2'}
];

function onBallClick(elBall, maxDiameter) {
    const ball = getBallModelByElement(elBall);
    ball.diameter += getRandomInt(20, 60);
    if (ball.diameter > maxDiameter) ball.diameter = 100;
    elBall.style.width = `${ball.diameter}px`;
    elBall.innerText = ball.diameter;
    elBall.style.backgroundColor = getRandomColor();
}

function getBallModelByElement(elBall) {
    for (const ball of balls) {
        if (elBall.classList.contains(ball.className)) return ball;
    }
    return null;
}