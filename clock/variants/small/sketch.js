let secondBalls = []; // array to hold seconds ball objects
let minBalls = []; // array to hold minutes ball objects
let hourBalls = []; // array to hold hours ball objects

let totalHours;

let canvasX = outerWidth * 0.2;
let canvasY = outerHeight * 0.8;

function setup() {
  createCanvas(canvasX, canvasY);
  noStroke();
  console.log("canvas x: ", canvasX);
  console.log("canvas y: ", canvasY);
}

function draw() {
  background("#0F1633");
  let now = clock();
  let t = frameCount / 60; // update time

  // hours of day
  if (now.pm && now.hour == 12) {
    totalHours = now.hour;
  } else if (now.pm) {
    totalHours = now.hour + 12;
  } else if (now.am && now.hour == 12) {
    totalHours = 0;
  } else {
    totalHours = now.hour;
  }
  console.log(totalHours);
  // seconds balls
  // create balls to match seconds count
  if (secondBalls.length < now.sec) {
    secondBalls.push(
      new ball(0, 0, 5, canvasY * 0.25, canvasX * 0.05, "#F77C7C")
    ); // append ball object
  }
  // delete balls once container is full
  if (now.sec >= 59) {
    secondBalls = [];
  }
  // loop through secondBalls with a for..of loop
  for (let flake of secondBalls) {
    flake.update(t); // update ball position
    flake.display(); // draw ball
  }

  // minutes balls
  // create balls to match minutes count
  if (minBalls.length < now.min) {
    minBalls.push(new ball(0, 0, 10, canvasY * 0.5, canvasX * 0.1, "#7C92F7")); // append ball object
  }
  // delete balls once container is full
  if (now.min >= 59) {
    minBalls = [];
  }
  // loop through secondBalls with a for..of loop
  for (let flake of minBalls) {
    flake.update(t); // update ball position
    flake.display(); // draw ball
  }

  // hours balls
  // create balls to match hours count
  if (hourBalls.length < totalHours) {
    hourBalls.push(
      new ball(0, 0, 20, canvasY * 0.75, canvasX * 0.2, "#F7CC7C")
    ); // append ball object
  }
  // delete balls once container is full
  if (totalHours >= 24) {
    hourBalls = [];
  }
  // loop through secondBalls with a for..of loop
  for (let flake of hourBalls) {
    flake.update(t); // update ball position
    flake.display(); // draw ball
  }
}

// ball class
function ball(posX, posY, size, shelfY, shelfWidth, color) {
  // initialize coordinates
  this.posX = posX;
  this.posY = posY;
  this.initialangle = random(0, 2 * PI);
  this.size = size;
  this.shelfY = shelfY;
  this.shelfWidth = shelfWidth;
  this.color = color;

  // radius of ball spiral
  // chosen so the secondBalls are uniformly spread out in area
  this.radius = sqrt(random(pow(0, 2)));

  this.update = function() {
    // x position centered
    this.posX = canvasX / 2;

    // different size secondBalls fall at slightly different y speeds
    if (this.posY >= this.shelfY) {
      this.posY == this.shelfY;
    } else {
      this.posY += pow(this.size, 0.5);
    }
  };

  this.display = function() {
    fill(this.color);
    ellipse(this.posX, this.posY, this.size);
  };
}

function mouseReleased() {
  remove();
  console.log("canvas removed");
}
