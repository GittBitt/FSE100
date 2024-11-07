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

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  initializeButtons(); // Create the buttons on setup
  setupMemoryGame(); // Set up the memory game
}

function draw() {
  background(100);

  if (scene === "title") {
    drawTitleScreen();
  } else if (scene === "memory") {
    drawMemoryGame();
    drawGameButtons();
  } else if (scene === "sorting") {
    drawSortingGame();
    drawGameButtons();
  } else if (scene === "reaction") {
    drawReactionGame();
    drawGameButtons();
  }
}

function drawTitleScreen() {
  background(100);
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Fine Motor Master", width / 2, height / 2 - 50);
  textSize(20);
  text("Select a game", width / 2, height / 2 + 5);

  // Draw buttons for the title screen
  let buttonX = (width - (buttons.length - 1) * 150) / 2; // Center the buttons horizontally
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
  let buttonX = (width - (buttons.length - 1) * 150) / 2;
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
    noLoop();
  }
}

function drawSortingGame() {
  // Logic for the matching game
  background(155, 255, 100);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Sorting Game", width / 2, height / 2);
}

function drawReactionGame() {
  // Logic for the reaction game
  background(255, 191, 0);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Reaction Game", width / 2, height / 2);
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

function mousePressed() {
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

// Sorting Game Specific Functions


// Reaction Game Specific Functions
function drawReactionGame(){
  let level = 1;
  let squares = [];
  let startTime, bestTime;
  let clicked = 0;
  let gameComplete = false;
  let totalTime;
  mousePressed();
  resetGame();
  
  background(255, 191, 0);
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
    text(`Time Left: ${(totalTime / 1000).toFixed(2)}s`, width / 2, height / 2 - 35);
  }
}

//Reaction Game Specifics 
function setupReactionGame(){
  mousePressed();
  function mousePressed() {
  if (!gameComplete) {
    for (let i = squares.length - 1; i >= 0; i--) {
      let d = dist(mouseX, mouseY, squares[i].x, squares[i].y);
      if (d < 25 && squares[i].num == clicked + 1) {
        clicked++;
        squares.splice(i, 1);
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
}