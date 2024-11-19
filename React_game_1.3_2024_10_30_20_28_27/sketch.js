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
  if (!gameComplete) { //if gameComplete is false
    for (var shape of squares) { 
      fill(shape.col);
      ellipse(shape.x, shape.y, 50, 50);
      fill(0);
      textAlign(CENTER, CENTER);
      text(shape.num, shape.x, shape.y);
    }

    fill(0);
    textSize(32);
    text(`Level: ${level}`, 70, 30);
    var currentTime = startTime - millis();
    timer = max(currentTime, 0);
    text(`Timer: ${(timer / 1000).toFixed(0)} seconds left`, 160, 70);

    if (timer == 0) {
      textSize(75);
      text('Time Up!', width / 2, height / 2);
      noLoop();
    }
  } else {
    textSize(50);
    text('Complete!', width /2, height / 2);
    textSize(32);
    text(`Time taken: ${(resultTime / 1000).toFixed(0)} seconds`, width / 2, height / 2 - 35);
  }
}

function mousePressed() { // Button and click funtions
  if (!gameComplete) { // if game is false
    for (let i = squares.length - 1; i >= 0; i--) { 
      var d = dist(mouseX, mouseY, squares[i].x, squares[i].y);
      if (d < 25 && squares[i].num == clicked + 1) {
        clicked++;
        squares.splice(i, 1); // removing the numbers when clicked
        if (clicked == level * (level == 1 ? 5 : level == 2 ? 7 : 12)) { // check what level is it on, then the numbers to click will increase
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

function resetGame() { //Resets the buttons and randomize the button numbers, resets timer as well
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