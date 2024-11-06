let level = 1;
let circles = [];
let startTime, bestTime;
let clicked = 0;
let gameComplete = false;
let totalTime;

function setup() {
  createCanvas(800, 600);
  resetGame();
}

function draw() {
  background(255);
  if (!gameComplete) {
    for (let circle of circles) {
      fill(circle.col);
      ellipse(circle.x, circle.y, 50, 50);
      fill(0);
      textAlign(CENTER, CENTER);
      text(circle.num, circle.x, circle.y);
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
    textSize(32);
    text(`Time Left: ${(totalTime / 1000).toFixed(2)}s`, width / 2, height / 2 - 35);
  }
}

function mousePressed() {
  if (!gameComplete) {
    for (let i = circles.length - 1; i >= 0; i--) {
      let d = dist(mouseX, mouseY, circles[i].x, circles[i].y);
      if (d < 25 && circles[i].num == clicked + 1) {
        clicked++;
        circles.splice(i, 1);
        if (clicked == level * (level == 1 ? 5 : level == 2 ? 7 : 12)) {
          totalTime = millis() - startTime;
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
  circles = [];
  for (let i = 1; i <= (level == 1 ? 5 : level == 2 ? 7 : 12); i++) {
    circles.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      col: color(random(255), random(255, random(255))),
      num: i
    });
  }
  clicked = 0;
  startTime = 20000;
  gameComplete = false;
  loop();
}
