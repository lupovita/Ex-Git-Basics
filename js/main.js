const ball = {diameter: 100};
function onBallClick(elBall) {
    ball.diameter += 50;
    if (ball.diameter > 400) ball.diameter = 100;
    elBall.style.width = `${ball.diameter}px`;
    elBall.innerText = ball.diameter;
}