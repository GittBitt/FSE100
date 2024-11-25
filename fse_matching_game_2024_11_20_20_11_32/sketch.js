let scene = "title"; // Use string for scene management
let buttons = []; // Array to hold game buttons

// Memory Game Variables
let cards = [];
let flippedCards = [];
let cols = 4, rows = 4;
let totalPairs = (cols * rows) / 2;
let matches = 0;
let cardSize = 100;
let isProcessing = false;
let revealDuration = 2000;
let revealedAtStart = true;

// Sorting Game Variables
let shapes = [];
let holes = [];
let selectedShape = null;
let score = 0;
let level = 1;
let exclamation = null;
let confetti = [];
let balloons = [];
let balloonTimer = 0;


// Reaction Game Variables
let ReactionLevel = 1;
let squares = [];
let startTime, bestTime;
let clicked = 0;
let gameComplete = false;
let totalTime;
let resultTime;

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  initializeButtons(); // Create the buttons on setup
  setupMemoryGame(); // Set up the memory game
  setupSortingGame(level);
  //setupReactionGame();
}

function draw() {
  background(100);

  if (scene == "title") {
    drawTitleScreen();
  } else if (scene == "memory") {
    drawMemoryGame();
    drawGameButtons();
  } else if (scene == "sorting") {
    drawSortingGame();
    drawGameButtons();
  } else if (scene == "reaction") {
    drawReactionGame();
    drawGameButtons();
  }
}

// Mouse Interaction
function mousePressed() {
  if (scene === "memory") {
    handleMemoryMousePress();
  } else if (scene === "sorting") {
    handleSortingMousePress();
  } else if (scene === "reaction") {
    handleReactionMousePress();
  }
}

function mouseReleased() {
  // Check if the selected shape matches a hole
  if (selectedShape) {
    let matched = false;
    for (let hole of holes) {
      if (hole.isInside(mouseX, mouseY) && selectedShape.type === hole.type) {
        // Correct match
        selectedShape.x = hole.x; // Move shape to hole
        selectedShape.y = hole.y;
        score++;
        confetti.push(new Confetti(mouseX, mouseY)); // Trigger confetti
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Incorrect match
      score--;
      exclamation = new Exclamation(mouseX, mouseY); // Display exclamation mark
    } else {
      // Correct placement, remove exclamation mark if any
      exclamation = null;
    }
    selectedShape = null; // Deselect shape
  }
}

function drawTitleScreen() {
  resetGame();
  
  var dokyo = loadFont("DOKYO.TTF");
  background(100);
  fill(255);
  textSize(70);
  textAlign(CENTER, CENTER);
  textFont(dokyo);
  text("Fine Motor Master", width / 2, height / 2 - 50);
  textSize(20);
  text("Select a game", width / 2, height / 2 + 5);

  // Draw buttons for the title screen
  let buttonX = (width - (buttons.length - 1) * 175) / 2; // Center the buttons horizontally
  let buttonY = height / 1.75;
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].position(buttonX + i * 150, buttonY);
    buttons[i].show();
  }
}

function initializeButtons() {
  // Create buttons for each game
  buttons = [
    createGameButton("Memory", () => (scene = "memory")),
    createGameButton("Sorting", () => (scene = "sorting")),
    createGameButton("Reaction", () => (scene = "reaction")),
    createGameButton("Quit", () => (scene = "title"))
  ];
}

function createGameButton(label, onClick) {
  let button = createButton(label);
  button.size(100, 50);
  button.style("font-size", "20px");
  button.mousePressed(onClick);
  return button;
}

function drawGameButtons() {
  // Position game buttons at the bottom of the canvas, excluding "Quit"
  let buttonX = (width - (buttons.length - 1) * 175) / 2;
  let buttonY = height - 100;
  for (let i = 0; i < buttons.length - 1; i++) {
    buttons[i].position(buttonX + i * 150, buttonY);
  }
  // Keep the "Quit" button in its original position
  buttons[3].position(buttonX + (buttons.length - 1) * 150, height - 100);
}

// Memory Game Functions
function drawMemoryGame() {
  background(100, 215, 215);
  strokeWeight(3);
  stroke(50);
  textSize(40);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Memory Game", width / 2, 30);
  // Center the memory game horizontally and position it at the top
  let gameWidth = cols * cardSize;
  let gameHeight = rows * cardSize;
  let xOffset = (width - gameWidth) / 2;
  let yOffset = 100; // Set yOffset to a fixed value near the top of the canvas

  push();
  translate(xOffset, yOffset); // Center horizontally and position near the top
  displayCards();
  pop();

  if (matches === totalPairs) {
    textSize(48);
    fill(0, 200, 0);
    stroke(0);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    text("🎉 You Won! 🎉", width / 2, height / 2);
    //Add score display here
    //noLoop();
  }
}


function handleMemoryMousePress() {
  if (isProcessing || revealedAtStart) return;

  let xOffset = (width - cols * cardSize) / 2;
  let yOffset = 100;

  for (let card of cards) {
    if (card.isFlipped || card.isMatched) continue;

    if (card.contains(mouseX - xOffset, mouseY - yOffset)) {
      card.flip();
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        checkMatch();
      }
      break;
    }
  }
}

// Sorting Game Functions
function drawSortingGame() {
  background(255, 204, 255); 
  strokeWeight(3);
  stroke(50);
  textSize(40);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Sorting Game", width / 2, 30);

  // Draw holes with borders
  for (let hole of holes) {
    hole.show();
  }

  // Draw shapes with bright colors
  for (let shape of shapes) {
    shape.show();
  }

  // Draw exclamation mark if there's an incorrect match
  if (exclamation) {
    exclamation.show();
  }

  // Draw confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].move();
    confetti[i].show();
    if (confetti[i].y > height) {
      confetti.splice(i, 1); // Remove off-screen confetti
    }
  }

  // Draw balloons if level is completed
  if (balloons.length > 0) {
    for (let balloon of balloons) {
      balloon.move();
      balloon.show();
    }
    // Balloons will be on screen for 5 seconds
    if (millis() - balloonTimer > 5000) {
      balloons = [];
    }
  }

  // Display score and level
  strokeWeight(3);
  stroke(50);
  textSize(40);
  fill(255);
  textAlign(CENTER, CENTER);
  text(`Level: ${level}`, 90, 30);
  text(`Score: ${score}`, 100, 60);

  // Check if all shapes are placed correctly and advance level
  if (checkLevelComplete()) {
    if (level < 3) {
      level++;
      setupSortingGame(level);
    } else {
      textSize(36);
      text("Congratulations! You've completed all levels!", (width / 2), (height / 2));
      //noLoop(); // Stops the draw loop, freezes at level 3
    }
  }

  // Highlight selected shape
  if (selectedShape) {
    stroke(0);
    strokeWeight(4);
    noFill();
    ellipse(selectedShape.x, selectedShape.y, 60, 60);
  }
}


function setupSortingGame(level) {
  // Reset shapes and holes
  shapes = [];
  holes = [];
  
  if (level === 1) {
    // Level 1 with 4 shapes
    holes.push(new Hole(random(50,400), random(100,400), 'circle'));
    holes.push(new Hole(random(50,400), random(100,400), 'star'));
    holes.push(new Hole(random(50,400), random(100,400), 'square'));
    holes.push(new Hole(random(50,400), random(100,400), 'trapezoid'));

    shapes.push(new Shape(random(50,400), random(100,400), 'circle', color(255, 0, 0)));    // Bright Red
    shapes.push(new Shape(random(50,400), random(100,400), 'star', color(255, 255, 0)));    // Bright Yellow
    shapes.push(new Shape(random(50,400), random(100,400), 'square', color(0, 255, 0)));    // Bright Green
    shapes.push(new Shape(random(50,400), random(100,400), 'trapezoid', color(255, 165, 0))); // Bright Orange
  } else if (level === 2) {
    // Level 2 with 5 shapes
    holes.push(new Hole(random(50,400), random(100,500), 'circle'));
    holes.push(new Hole(random(50,400), random(100,500), 'star'));
    holes.push(new Hole(random(50,400), random(100,500), 'square'));
    holes.push(new Hole(random(50,400), random(100,500), 'trapezoid'));
    holes.push(new Hole(random(50,400), random(100,500), 'triangle'));

    shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));    // Bright Red
    shapes.push(new Shape(250, 400, 'star', color(255, 255, 0)));    // Bright Yellow
    shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));    // Bright Green
    shapes.push(new Shape(450, 400, 'trapezoid', color(255, 165, 0))); // Bright Orange
    shapes.push(new Shape(550, 400, 'triangle', color(0, 0, 255)));  // Bright Blue
  } else if (level === 3) {
    // Level 3 with 6 shapes
    holes.push(new Hole(random(50,400), random(100,500), 'circle'));
    holes.push(new Hole(random(50,400), random(100,500), 'star'));
    holes.push(new Hole(random(50,400), random(100,500), 'square'));
    holes.push(new Hole(random(50,400), random(100,500), 'trapezoid'));
    holes.push(new Hole(random(50,400), random(100,500), 'triangle'));
    holes.push(new Hole(random(50,400), random(100,500), 'pentagon'));

    shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));    // Bright Red
    shapes.push(new Shape(250, 400, 'star', color(255, 255, 0)));    // Bright Yellow
    shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));    // Bright Green
    shapes.push(new Shape(450, 400, 'trapezoid', color(255, 165, 0))); // Bright Orange
    shapes.push(new Shape(550, 400, 'triangle', color(0, 0, 255)));  // Bright Blue
    shapes.push(new Shape(650, 400, 'pentagon', color(255, 105, 180))); // Bright Pink
  }
}

function handleSortingMousePress() {
  // Check if a shape is clicked
  for (let shape of shapes) {
    if (shape.isInside(mouseX, mouseY)) {
      selectedShape = shape;
      selectedShape.offsetX = mouseX - selectedShape.x;
      selectedShape.offsetY = mouseY - selectedShape.y;
      break;
    }
  }
}

function mouseDragged() {
  // If a shape is selected, move it with the cursor
  if (selectedShape) {
    selectedShape.x = mouseX - selectedShape.offsetX;
    selectedShape.y = mouseY - selectedShape.offsetY;
  }
}

function checkLevelComplete() {
  // Check if all shapes are placed correctly
  for (let shape of shapes) {
    if (shape.x !== holes[shapes.indexOf(shape)].x || shape.y !== holes[shapes.indexOf(shape)].y) {
      return false;
    }
  }

  // Add balloons on level completion
  balloons.push(new Balloon(random(width), height));
  balloonTimer = millis(); // Timer for 5 seconds duration for balloons

  return true;
}

// Reaction Specific Functions ==========================================
function drawReactionGame() {
  // Logic for the reaction game
  background(255, 191, 0);
  strokeWeight(3);
  stroke(50);
  textSize(40);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Reaction Game", width / 2, 30);
  
  //Stevie Part
  var currentTime = startTime - millis();
    fill(255);
    textSize(40);
    if (!gameComplete) { //if gameComplete is false
    for (var shape of squares) { 
      fill(shape.col);
      ellipse(shape.x, shape.y, 50, 50);
      fill(255);
      textAlign(CENTER, CENTER);
      text(shape.num, shape.x, shape.y);
      timer = max(currentTime, 0);
      
    }
    textSize(40);
    text(`Timer: ${(timer / 1000).toFixed(0)} seconds left`, 230, 70);
    text(`Level: ${ReactionLevel}`, 85, 30);

    if (timer == 0) {
      textSize(75);
      text('Time Up!', width / 2, height / 2);
      timer == startTime - millis();
      //noLoop();
    }
  } else {
    textSize(50);
    text('Complete!', width /2, height / 2);
    textSize(32);
    text(`Time taken: ${(resultTime / 1000).toFixed(0)} seconds`, width / 2, height / 2 - 35);
    
  }
}

// Confetti class
class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.color = color(random(255), random(255), random(255));
    this.velocity = createVector(random(-2, 2), random(-5, 0));
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += 0.1; // Gravity effect
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Exclamation class
class Exclamation {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(255, 0, 0);
    textSize(64);
    textAlign(CENTER, CENTER);
    text('!', this.x, this.y);
  }
}

// Balloon class
class Balloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(30, 50);
    this.color = color(random(255), random(255), random(255));
    this.speed = random(1, 3);
  }

  move() {
    this.y -= this.speed;
  }

  show() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
    line(this.x, this.y + this.size / 2, this.x, this.y + this.size + 10); // Balloon string
  }
}

// Shape class
class Shape {
  constructor(x, y, type, c) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = c;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  show() {
    fill(this.color);
    noStroke();
    if (this.type === 'circle') {
      ellipse(this.x, this.y, 60, 60);
    } else if (this.type === 'square') {
      rect(this.x - 30, this.y - 30, 60, 60);
    } else if (this.type === 'triangle') {
      triangle(this.x, this.y - 30, this.x - 30, this.y + 30, this.x + 30, this.y + 30);
    } else if (this.type === 'star') {
      this.drawStar(this.x, this.y, 30, 15, 5);
    } else if (this.type === 'trapezoid') {
      this.drawTrapezoid(this.x, this.y, 60, 40);
    } else if (this.type === 'pentagon') {
      this.drawPentagon(this.x, this.y, 40);
    }
  }

  isInside(px, py) {
    if (this.type === 'circle') {
      return dist(px, py, this.x, this.y) < 30;
    } else if (this.type === 'square') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30;
    } else if (this.type === 'triangle') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30;
    } else if (this.type === 'star') {
      return dist(px, py, this.x, this.y) < 30;
    } else if (this.type === 'trapezoid') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 20 && py < this.y + 20;
    } else if (this.type === 'pentagon') {
      return dist(px, py, this.x, this.y) < 40;
    }
    return false;
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  drawTrapezoid(x, y, width, height) {
    fill(this.color);
    noStroke();
    beginShape();
    vertex(x - width / 2, y + height / 2); // Bottom left
    vertex(x + width / 2, y + height / 2); // Bottom right
    vertex(x + width / 4, y - height / 2); // Top right
    vertex(x - width / 4, y - height / 2); // Top left
    endShape(CLOSE);
  }

  drawPentagon(x, y, radius) {
    fill(this.color);
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      let vx = x + cos(angle) * radius;
      let vy = y + sin(angle) * radius;
      vertex(vx, vy);
    }
    endShape(CLOSE);
  }
}

// Hole class
class Hole {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  show() {
    fill(255); // White color for the hole itself
    stroke(0); // Black border around holes
    strokeWeight(2); // Thin border
    if (this.type === 'circle') {
      ellipse(this.x, this.y, 60, 60);
    } else if (this.type === 'square') {
      rect(this.x - 30, this.y - 30, 60, 60);
    } else if (this.type === 'triangle') {
      triangle(this.x, this.y - 30, this.x - 30, this.y + 30, this.x + 30, this.y + 30);
    } else if (this.type === 'star') {
      this.drawStar(this.x, this.y, 30, 15, 5);
    } else if (this.type === 'trapezoid') {
      this.drawTrapezoid(this.x, this.y, 60, 40); // Border added here
    } else if (this.type === 'pentagon') {
      this.drawPentagon(this.x, this.y, 40);
    }
  }

  isInside(px, py) {
    if (this.type === 'circle') {
      return dist(px, py, this.x, this.y) < 30;
    } else if (this.type === 'square') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30;
    } else if (this.type === 'triangle') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30;
    } else if (this.type === 'star') {
      return dist(px, py, this.x, this.y) < 30;
    } else if (this.type === 'trapezoid') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 20 && py < this.y + 20;
    } else if (this.type === 'pentagon') {
      return dist(px, py, this.x, this.y) < 40;
    }
    return false;
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  drawTrapezoid(x, y, width, height) {
    fill(255); // Hole color
    stroke(0); // Border for trapezoid hole
    strokeWeight(2);
    beginShape();
    vertex(x - width / 2, y + height / 2); // Bottom left
    vertex(x + width / 2, y + height / 2); // Bottom right
    vertex(x + width / 4, y - height / 2); // Top right
    vertex(x - width / 4, y - height / 2); // Top left
    endShape(CLOSE);
  }

  drawPentagon(x, y, radius) {
    fill(255); // Hole color
    stroke(0); // Border for pentagon hole
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      let vx = x + cos(angle) * radius;
      let vy = y + sin(angle) * radius;
      vertex(vx, vy);
    }
    endShape(CLOSE);
  }
}

// Memory Game Specific Functions
function setupMemoryGame() {
  cards = [];
  flippedCards = [];
  matches = 0;
  generateCards();
  shuffle(cards, true);
  randomizeCardPositions();

  for (let card of cards) {
    card.isFlipped = true;
  }

  setTimeout(() => {
    for (let card of cards) {
      card.isFlipped = false;
    }
    revealedAtStart = false;
  }, revealDuration);
}

function generateCards() {
  let cardValues = [];
  for (let i = 0; i < totalPairs; i++) {
    cardValues.push(i);
    cardValues.push(i);
  }

  for (let i = 0; i < cardValues.length; i++) {
    let x = (i % cols) * cardSize;
    let y = floor(i / cols) * cardSize;
    cards.push(new Card(x, y, cardValues[i]));
  }
}

function randomizeCardPositions() {
  let positions = [];
  for (let i = 0; i < cols * rows; i++) {
    let x = (i % cols) * cardSize;
    let y = floor(i / cols) * cardSize;
    positions.push({ x, y });
  }
  shuffle(positions, true);
  for (let i = 0; i < cards.length; i++) {
    cards[i].x = positions[i].x;
    cards[i].y = positions[i].y;
  }
}

function displayCards() {
  for (let card of cards) {
    card.show();
  }
}

function checkMatch() {
  let [card1, card2] = flippedCards;
  isProcessing = true;

  setTimeout(() => {
    if (card1.value === card2.value) {
      card1.isMatched = true;
      card2.isMatched = true;
      matches++;
    } else {
      card1.flip();
      card2.flip();
    }
    flippedCards = [];
    isProcessing = false;
  }, 1000);
}

// Card Class
class Card {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.size = cardSize;
    this.value = value;
    this.isFlipped = false;
    this.isMatched = false;
  }

  show() {
    if (!this.isMatched) {
      stroke(50);
      strokeWeight(2);
      fill(this.isFlipped ? 240 : 100);
      rect(this.x, this.y, this.size, this.size, 10);

      if (this.isFlipped) {
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(this.value, this.x + this.size / 2, this.y + this.size / 2);
      }
    }
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.size && py > this.y && py < this.y + this.size;
  }
}


// Reaction Game Specific Functions
function handleReactionMousePress() { // Button and click funtions
  if (!gameComplete) { // if game is false
    for (let i = squares.length - 1; i >= 0; i--) { 
      var d = dist(mouseX, mouseY, squares[i].x, squares[i].y);
      if (d < 25 && squares[i].num == clicked + 1) {
        clicked++;
        squares.splice(i, 1); // removing the numbers when clicked
        if (clicked == ReactionLevel * (ReactionLevel == 1 ? 5 : ReactionLevel == 2 ? 7 : 12)) { // check what ReactionLevel is it on, then the numbers to click will increase
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
  for (let i = 1; i <= (ReactionLevel == 1 ? 5 : ReactionLevel == 2 ? 7 : 12); i++) {
    squares.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      col: color(random(255), random(255, random(100))),
      num: i
    });
  }
  clicked = 0;
  startTime = 20000; //default is 20,000 s
  gameComplete = false;
  loop();
}