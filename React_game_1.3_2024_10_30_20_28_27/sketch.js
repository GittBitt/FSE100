let level = 1;
let circles = [];
let startTime, bestTime;
let clicked = 0;
let gameComplete = false;
let totalTime;
let inMenu = true;

function setup() {
  createCanvas(800, 600);
  showMenu();
}

//The whole game picture, with numbers to click and a timer display.
function draw() {
  if (!inMenu) {
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

      if (startTime == 0) {
        textSize(75);
        text('Time Up!', width / 2, height / 2);
        noLoop();
      }
    } else {
      textSize(32);
      text(`Total Time: ${(totalTime / 1000).toFixed(2)}s`, width / 2, height / 2 - 35);
    }
  }
}

//Menu at the start, button are having issues however, need fix.
function showMenu() {
  inMenu = true;
  background(100, 150, 10);
  fill(220, 250, 50);
  textSize(120);
  textAlign(CENTER, CENTER);
  text('Reacting Game', width / 2, height / 2 - 160);
  
  fill(70, 250, 150);
  textSize(40);
  text('Click numbers in order as fast as you can', width / 2, height / 2);
  createButton('Start Game').position(width / 2 - 60, height / 2 + 120).mousePressed(startGame);
  createButton('Quit').position(width / 2 - 60, height / 2 + 160).mousePressed(quitGame);
}

function startGame() {
  level = 1;
  inMenu = false;
  resetGame();
}

function quitGame() {
  noLoop();
  background(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  fill(0);
  text('', width / 2, height / 2);
}

function mousePressed() {
  if (!inMenu && !gameComplete) {
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
          showButtons();
        }
        break;
      }
    }
  }
}

function showButtons() {
  createButton('Next Level').position(width / 2 - 60, height / 2 + 20).mousePressed(nextLevel);
  createButton('Reset Game').position(width / 2 + 40, height / 2 + 20).mousePressed(resetGame);
}

function nextLevel() {
  level++;
  resetGame();
}

//Next level and and there should be 5.
function resetGame() {
  circles = [];
  for (let i = 1; i <= (level == 1 ? 5 : level == 2 ? 7 : 12); i++) {
    circles.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      col: color(random(255), random(255), random(255)),
      num: i
    });
  }
  clicked = 0;
  startTime = 20000;
  gameComplete = false;
  loop();
}
