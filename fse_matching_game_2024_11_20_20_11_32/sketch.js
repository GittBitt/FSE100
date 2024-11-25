let shapes = [];
let holes = [];
let selectedShape = null;
let score = 0;
let level = 1;
let exclamation = null;
let confetti = [];
let balloons = [];
let balloonTimer = 0;

function setup() {
  createCanvas(800, 600);
  startLevel(level);
}

function draw() {
  background(255, 204, 255); 

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
  fill(0);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
  text(`Level: ${level}`, 10, 60);

  // Check if all shapes are placed correctly and advance level
  if (checkLevelComplete()) {
    if (level < 3) {
      level++;
      startLevel(level);
    } else {
      textSize(36);
      text("Congratulations! You've completed all levels!", 100, height / 2);
      noLoop(); // Stops the draw loop, freezes at level 3
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

function mousePressed() {
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

function startLevel(level) {
  // Reset shapes and holes
  shapes = [];
  holes = [];
  
  if (level === 1) {
    // Level 1 with 4 shapes
    holes.push(new Hole(150, 150, 'circle'));
    holes.push(new Hole(250, 150, 'star'));
    holes.push(new Hole(350, 150, 'square'));
    holes.push(new Hole(450, 150, 'trapezoid'));

    shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));    // Bright Red
    shapes.push(new Shape(250, 400, 'star', color(255, 255, 0)));    // Bright Yellow
    shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));    // Bright Green
    shapes.push(new Shape(450, 400, 'trapezoid', color(255, 165, 0))); // Bright Orange
  } else if (level === 2) {
    // Level 2 with 5 shapes
    holes.push(new Hole(150, 150, 'circle'));
    holes.push(new Hole(250, 150, 'star'));
    holes.push(new Hole(350, 150, 'square'));
    holes.push(new Hole(450, 150, 'trapezoid'));
    holes.push(new Hole(550, 150, 'triangle'));

    shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));    // Bright Red
    shapes.push(new Shape(250, 400, 'star', color(255, 255, 0)));    // Bright Yellow
    shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));    // Bright Green
    shapes.push(new Shape(450, 400, 'trapezoid', color(255, 165, 0))); // Bright Orange
    shapes.push(new Shape(550, 400, 'triangle', color(0, 0, 255)));  // Bright Blue
  } else if (level === 3) {
    // Level 3 with 6 shapes
    holes.push(new Hole(150, 150, 'circle'));
    holes.push(new Hole(250, 150, 'star'));
    holes.push(new Hole(350, 150, 'square'));
    holes.push(new Hole(450, 150, 'trapezoid'));
    holes.push(new Hole(550, 150, 'triangle'));
    holes.push(new Hole(650, 150, 'pentagon'));

    shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));    // Bright Red
    shapes.push(new Shape(250, 400, 'star', color(255, 255, 0)));    // Bright Yellow
    shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));    // Bright Green
    shapes.push(new Shape(450, 400, 'trapezoid', color(255, 165, 0))); // Bright Orange
    shapes.push(new Shape(550, 400, 'triangle', color(0, 0, 255)));  // Bright Blue
    shapes.push(new Shape(650, 400, 'pentagon', color(255, 105, 180))); // Bright Pink
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
