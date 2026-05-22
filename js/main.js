'use strict'

const ball = {diameter: 100};

function onBallClick(elBall) {
    ball.diameter += getRandomInt(20, 60);
    if (ball.diameter > 400) ball.diameter = 100;
    elBall.style.width = `${ball.diameter}px`;
    elBall.innerText = ball.diameter;
    elBall.style.backgroundColor = getRandomColor();
}