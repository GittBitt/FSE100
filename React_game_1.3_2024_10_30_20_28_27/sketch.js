let level = 1;
let squares = [];
let startTime, bestTime;
let clicked = 0;
let gameComplete = false;
let totalTime;
let resultTime;

function setup() {
  createCanvas(800, 600);
  resetGame();
}

function draw() {
  background(255);
  if (!gameComplete) {
    for (let shape of squares) {
      fill(shape.col);
      ellipse(shape.x, shape.y, 50, 50);
      fill(0);
      textAlign(CENTER, CENTER);
      text(shape.num, shape.x, shape.y);
    }

    fill(0);
    textSize(32);
    text(`Level: ${level}`, 70, 30);
    let currentTime = startTime - millis();
    currentTime = max(currentTime, 0);
    text(`Timer: ${(currentTime / 1000).toFixed(2)}s`, 100, 70);

    if (currentTime == 0) {
      textSize(75);
      text('Time Up!', width / 2, height / 2);
      noLoop();
    }
  } else {
    textSize(50);
    text('Complete!', width /2, height / 2);
    textSize(32);
    text(`Time taken: ${(resultTime / 1000).toFixed(2)}s`, width / 2, height / 2 - 35);
  }
}

function mousePressed() {
  if (!gameComplete) {
    for (let i = squares.length - 1; i >= 0; i--) {
      let d = dist(mouseX, mouseY, squares[i].x, squares[i].y);
      if (d < 25 && squares[i].num == clicked + 1) {
        clicked++;
        squares.splice(i, 1);
        if (clicked == level * (level == 1 ? 5 : level == 2 ? 7 : 12)) {
          totalTime = millis() - startTime;
          resultTime =+ millis();
          if (!bestTime || totalTime < bestTime) {
            bestTime = totalTime;
          }
          gameComplete = true;
        }
        break;
      }
    }
  }
}

function resetGame() {
  squares = [];
  for (let i = 1; i <= (level == 1 ? 5 : level == 2 ? 7 : 12); i++) {
    squares.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      col: color(random(255), random(255, random(100))),
      num: i
    });
  }
  clicked = 0;
  startTime = 20000;
  gameComplete = false;
  loop();
}