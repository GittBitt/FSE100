// Sets up the Board
let cards = [];
let flippedCards = [];
let cols = 4, rows = 4;  
let totalPairs = (cols * rows) / 2;
let matches = 0;
let cardSize = 100;
let isProcessing = false;
let revealDuration = 2000; // Duration to show cards at the start (in milliseconds)
let revealedAtStart = true; // Flag to check if initial reveal period is active

function setup() {
  createCanvas(cols * cardSize, rows * cardSize);
  generateCards();
  shuffle(cards, true);
  randomizeCardPositions();

  // Flip all cards face-up initially
  for (let card of cards) {
    card.isFlipped = true;
  }

  // Set a timer to flip them back over after the reveal duration
  setTimeout(() => {
    for (let card of cards) {
      card.isFlipped = false;
    }
    revealedAtStart = false;
  }, revealDuration);
}

function draw() {
  background(150, 200, 255); // Light blue background
  displayCards();
  
  if (matches === totalPairs) {
    textSize(48);
    fill(0, 200, 0);
    stroke(0);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    text("🎉 You Won! 🎉", width / 2, height / 2); // Improved win message
    noLoop(); // Stop the game once all pairs are matched
  }
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

  for (let card of cards) {
    if (card.isFlipped || card.isMatched) continue;

    if (card.contains(mouseX, mouseY)) {
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
      fill(this.isFlipped ? 240 : 100); // Light grey for flipped, darker grey for unflipped

      // Rounded rectangle with a shadow effect
      if (this.isFlipped) {
        push();
        fill(220);
        rect(this.x + 5, this.y + 5, this.size, this.size, 10); // Shadow effect
        pop();
      }
      rect(this.x, this.y, this.size, this.size, 10); // Rounded corners

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
