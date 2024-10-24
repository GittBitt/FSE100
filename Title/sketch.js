var scene = "title";  // Use string for scene management

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
}

function draw() {
  // Title Screen
  if (scene === "title") {
    background(100);
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Fine Motor Master", width / 2, height / 2 - 50);
    textSize(20);
    text("Select a game", width / 2, (height / 2 + 5) );
    memoryButton();
    matchingButton();
    reactionButton();
    quitButton();
  } else if (scene === "memory") {
    // Your memory game logic here
    background(100,215,215);
    fill(255);
    textSize(40);
    text("Memory Game", width / 2, height / 2);
  } else if (scene === "matching") {
    // Your matching game logic here
    background(155,255,100);
    fill(255);
    textSize(40);
    text("Matching Game", width / 2, height / 2);
  } else if (scene == "reaction") {
    // Your matching game logic here
    background(255,191,0);
    fill(255);
    textSize(40);
    text("Reaction Game", width / 2, height / 2);
  }
}

// Button for Memory Game
function memoryButton() {
  let button = createButton("Memory");
  button.size(100, 50);
  button.position(width / 6, height / 1.75);
  button.style("font-size", "20px");
  button.mousePressed(() => {
    scene = "memory";  // Change to "memory" scene on click
  });
}

// Button for Matching Game
function matchingButton() {
  let button = createButton("Matching");
  button.size(100, 50);
  button.position(width / 3, height / 1.75);
  button.style("font-size", "20px");
  button.mousePressed(() => {
    scene = "matching";  // Change to "matching" scene on click
  });
}

// Button for Reaction Game
function reactionButton() {
  let button = createButton("Reaction");
  button.size(100, 50);
  button.position(width / 2, height / 1.75);
  button.style("font-size", "20px");
  button.mousePressed(() => {
    scene = "reaction";  // Change to "reaction" scene on click
  });
}

// Button for Quit
function quitButton() {
  let button = createButton("Quit");
  button.size(100, 50);
  button.position(width / 1.5, height / 1.75);
  button.style("font-size", "20px");
  button.mousePressed(() => {
    scene = "title";  // Change to "title" scene on click
  });
  
}
