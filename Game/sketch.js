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

// Reaction Game Variables
let level = 1;
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
  setupSortingGame();
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
  // Center the memory game horizontally and position it at the top
  let gameWidth = cols * cardSize;
  let gameHeight = rows * cardSize;
  let xOffset = (width - gameWidth) / 2;
  let yOffset = 50; // Set yOffset to a fixed value near the top of the canvas

  push();
  translate(xOffset, yOffset); // Center horizontally and position near the top
  background(100, 215, 215);
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

function drawSortingGame() {
  // Logic for the matching game
  background(155, 255, 100);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Sorting Game", width / 2, 30);
  
    // Draw holes
  for (let hole of holes) {
    hole.show();
  }
  
  // Draw shapes
  for (let shape of shapes) {
    shape.show();
  }

  // Highlight selected shape
  if (selectedShape) {
    stroke(0);
    strokeWeight(4);
    noFill();
    ellipse(selectedShape.x, selectedShape.y, 60, 60);
  }
}

function drawReactionGame() {
  // Logic for the reaction game
  background(255, 191, 0);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Reaction Game", width / 2, 30);
  
  //Stevie Part
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
    text(`Timer: ${(timer / 1000).toFixed(0)} seconds left`, 190, 70);

    if (timer == 0) {
      textSize(75);
      text('Time Up!', width / 2, height / 2);
      //noLoop();
    }
  } else {
    textSize(50);
    text('Complete!', width /2, height / 2);
    textSize(32);
    text(`Time taken: ${(resultTime / 1000).toFixed(0)} seconds`, width / 2, height / 2 - 35);
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

/*function mousePressed() {
  if (isProcessing || revealedAtStart) return;

  let xOffset = (width - cols * cardSize) / 2;
  let yOffset = 50; // Adjust yOffset to match the translation

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
}*/

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

// Sorting Game Specific Functions
function setupSortingGame() {
    // Create holes
  holes.push(new Hole(150, 150, 'circle'));
  holes.push(new Hole(250, 150, 'star'));
  holes.push(new Hole(350, 150, 'square'));
  holes.push(new Hole(450, 150, 'trapezoid'));
  holes.push(new Hole(550, 150, 'triangle'));
  
  // Create shapes
  shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));  // Red circle
  shapes.push(new Shape(250, 400, 'star', color(255, 255, 0))); // Yellow star
  shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));  // Green square
  shapes.push(new Shape(450, 400, 'trapezoid', color(255, 105, 180))); // Pink trapezoid
  shapes.push(new Shape(550, 400, 'triangle', color(0, 0, 255))); // Blue triangle
}

function mouseReleased() {
  if (scene === "sorting") {
    handleSortingMouseRelease();
  }
}

function handleMemoryMousePress() {
  if (isProcessing || revealedAtStart) return;

  let xOffset = (width - cols * cardSize) / 2;
  let yOffset = 50;

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

function handleSortingMousePress() {
  for (let shape of shapes) {
    if (shape.isInside(mouseX, mouseY)) {
      selectedShape = shape;
      offsetX = mouseX - shape.x;
      offsetY = mouseY - shape.y;
      break;
    }
  }
}

function handleSortingMouseRelease() {
  if (selectedShape) {
    for (let hole of holes) {
      if (hole.isInside(mouseX, mouseY) && selectedShape.type === hole.type) {
        selectedShape.x = hole.x;
        selectedShape.y = hole.y;
        break;
      }
    }
    selectedShape = null;
  }
}
// Shape class
class Shape {
  constructor(x, y, type, c) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = c;
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
    }
  }

  isInside(px, py) {
    if (this.type === 'circle') {
      return dist(px, py, this.x, this.y) < 30;
    } else if (this.type === 'square') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30;
    } else if (this.type === 'triangle') {
      return (px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30);
    } else if (this.type === 'star') {
      return dist(px, py, this.x, this.y) < 30; // Simplified for click detection
    } else if (this.type === 'trapezoid') {
      return (px > this.x - 30 && px < this.x + 30 && py > this.y - 20 && py < this.y + 20); // Simplified bounding box
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
}

// Hole class
class Hole {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  show() {
    noFill();
    stroke(0);
    strokeWeight(2);
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
    }
  }

  isInside(px, py) {
    if (this.type === 'circle') {
      return dist(px, py, this.x, this.y) < 30;
    } else if (this.type === 'square') {
      return px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30;
    } else if (this.type === 'triangle') {
      return (px > this.x - 30 && px < this.x + 30 && py > this.y - 30 && py < this.y + 30);
    } else if (this.type === 'star') {
      return dist(px, py, this.x, this.y) < 30; // Simplified for click detection
    } else if (this.type === 'trapezoid') {
      return (px > this.x - 30 && px < this.x + 30 && py > this.y - 20 && py < this.y + 20); // Simplified bounding box
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
    noFill();
    stroke(0);
    strokeWeight(2);
    beginShape();
    vertex(x - width / 2, y + height / 2); // Bottom left
    vertex(x + width / 2, y + height / 2); // Bottom right
    vertex(x + width / 4, y - height / 2); // Top right
    vertex(x - width / 4, y - height / 2); // Top left
    endShape(CLOSE);
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