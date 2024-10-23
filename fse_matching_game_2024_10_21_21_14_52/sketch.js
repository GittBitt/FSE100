let shapes = [];
let holes = [];
let selectedShape = null;

function setup() {
  createCanvas(800, 600);
  
  // Create holes
  holes.push(new Hole(150, 150, 'circle'));
  holes.push(new Hole(250, 150, 'star'));
  holes.push(new Hole(350, 150, 'square'));
  holes.push(new Hole(450, 150, 'trapezoid'));
  holes.push(new Hole(550, 150, 'triangle'));
  
  // Create shapes
  shapes.push(new Shape(150, 400, 'circle', color(255, 0, 0)));  // Red circle
  shapes.push(new Shape(300, 400, 'star', color(255, 255, 0))); // Yellow star
  shapes.push(new Shape(350, 400, 'square', color(0, 255, 0)));  // Green square
  shapes.push(new Shape(450, 400, 'trapezoid', color(255, 105, 180))); // Pink trapezoid
  shapes.push(new Shape(550, 400, 'triangle', color(0, 0, 255))); // Blue triangle
}

function draw() {
  background(220);
  
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

function mousePressed() {
  // Check if a shape is clicked
  for (let shape of shapes) {
    if (shape.isInside(mouseX, mouseY)) {
      selectedShape = shape;
      break;
    }
  }
}

function mouseReleased() {
  // Check if the selected shape matches a hole
  if (selectedShape) {
    for (let hole of holes) {
      if (hole.isInside(mouseX, mouseY) && selectedShape.type === hole.type) {
        // Match found
        selectedShape.x = hole.x; // Move shape to the hole
        selectedShape.y = hole.y;
        break;
      }
    }
    selectedShape = null; // Deselect shape
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