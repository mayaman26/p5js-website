/* @name ArrayList of Objects
 * @description This example demonstrates how to use
 * a Java ArrayList to store a variable number of objects.
 * Items can be added and removed from the ArrayList.
 * Click the mouse to add bouncing balls.
 */
let balls = [];
let ballWidth = 48;

function setup() {
  createCanvas(640, 360);
  noStroke();
  // Start by adding one element
  balls.push(new Ball(width/2, 0, ballWidth));
}

function draw() {
  background(255,200,0);
  // With an array, we say balls.length, with an ArrayList, we say balls.size()
  // The length of an ArrayList is dynamic
  // Notice how we are looping through the ArrayList backwards
  // This is because we are deleting elements from the list
  for (let i = balls.length - 1; i >= 0; i--) {
    // An ArrayList doesn't know what it is storing so we have to cast the object coming out
    let ball = balls[i];
    ball.move();
    ball.display();
    if (balls[i].finished()) {
      // Items can be deleted with remove()
      balls.splice(i,1);
    }
  }
}

function mousePressed() {
  // A new ball object is added to the ArrayList (by default to the end)
  balls.push(new Ball(mouseX, mouseY, random(ballWidth, 10)));
}

// Simple bouncing ball class

class Ball {
  constructor(tempX, tempY, tempW) {
    this.x = tempX;
    this.y = tempY;
    this.w = tempW;
    this.speed = 0;
    this.gravity = 0.1;
    this.life = 255;
  }

  move() {
    // Add gravity to speed
    this.speed = this.speed + this.gravity;
    // Add speed to y location
    this.y = this.y + this.speed;
    // If square reaches the bottom
    // Reverse speed
    if (this.y > height) {
      // Dampening
      this.speed = this.speed * -0.8;
      this.y = height;
    }
  }

  finished() {
    // Balls fade out
    this.life--;
    if (this.life < 0) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    // Display the circle
    fill(0,this.life);
    //stroke(0,life);
    ellipse(this.x,this.y,this.w,this.w);
  }
}