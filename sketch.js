//image variables
var gpaddle, bpaddle, wpaddle, brpaddle;
var playerR, playerL, playerUp;
var springUp, springDown;
var bullet;
var bg;
var playimg;
var player;
var time;
var start, speed, end;
var currentSpImage, currentBrImage;
var transparent;
var topbar;
var endscreen;
var screenBottom = 460;
var end = 300000;

//speed that the paddles move down
var speedDown = 1;

//score variables
var score = 0;

//state variables
var state = 0;

//sound variables
var jumpsound;
var springsound;
var brokensound;
var shotsound;

//array variables
var greenPaddles = [];
var springPaddles = [];
var movingPaddles = [];
var bluePaddles = [];
var brokenPaddles = [];
var bats = [];
var bullets = [];

var brokenGraphics = [];
var batGraphics = [];
var springGraphics = [];

var brCurrentFrame = 0;
var batCurrentFrame = 0;
var spCurrentFrame = 0;

function preload() {
  //load paddles
  gpaddle = loadImage("p-green.png");
  bpaddle = loadImage("p-blue.png");
  wpaddle = loadImage("p-white.png");
  topbar = loadImage("topbar.png");
  intro = loadImage("introscreen.jpg");
  endscreen = loadImage("endscreen.png");

  //load broken paddles
  for (var i = 1; i <= 6; i++) {
    var filename = "p-brown-" + nf(i,1) + ".png";
    brokenGraphics.push (loadImage ("images/broken/" + filename));
  }
  //load transparent image
  brokenGraphics.push(loadImage("images/broken/transparent.png"));

  //load bat graphics
  for (var i = 1; i <= 3; i++) {
    var filename = "bat" + nf(i,1) + ".png";
    batGraphics.push (loadImage ("images/bat/" + filename));
  }

  //load spring graphics
  for (var i = 0; i <= 1; i++) {
    var filename = "p-green-s" + nf(i,0) + ".png";
    springGraphics.push (loadImage ("images/spring/" + filename));
  }

  //load background
  bg = loadImage("bg-grid.png");

  //load bullets
  bullet = loadImage("bullet.png");

  //load character
  playerR = loadImage("doodleR.png");
  playerL = loadImage("doodleL.png");
  playerUp = loadImage("doodleS.png");

  //load sounds
  jumpsound = loadSound("jumpsound.mp4");
  springsound = loadSound("springsound.mp4");
  brokensound = loadSound("brokensound.mp4");
  shotsound = loadSound("shotsound.mp4");
}

function setup() {
  randomSeed(12);
  //setup canvas
  // var theCanvas = createCanvas(320,480);
  // theCanvas.parent("#canvascontainer");
  createCanvas(300,500);

  reset();
}

function draw() {
  //start screen
  if (state == 0) {
    imageMode(CORNER);
    background(intro, 250,250, 1000,500);
    fill(240,240,230);
    textFont('Helvetica');
    textSize(10);
    text("Spacebar = shoot", 160,470);
    text("Right and left arrows = move", 160,485);
  }

  //playing the game
  if (state == 1) {
    imageMode(CORNER);
    background(bg, 250,250, 1000,500);

    player.move();
    player.display();
    player.detect();

    //create green paddles
    for (var i = 0; i < greenPaddles.length; i++) {
      greenPaddles[i].display();
      greenPaddles[i].fall();
    }

    //create spring paddles
    for (var i = 0; i < springPaddles.length; i++) {
      springPaddles[i].display();
      springPaddles[i].fall();
    }

    //create moving paddles
    for (var i = 0; i < movingPaddles.length; i++) {
      movingPaddles[i].display();
      movingPaddles[i].move();
      movingPaddles[i].fall();
    }

    //create broken paddles
    for (var i = 0; i < brokenPaddles.length; i++) {
      brokenPaddles[i].display();
      //brokenPaddles[i].move();
      brokenPaddles[i].fall();
    }

    //create bats
    for (var i = 0; i < bats.length; i++) {
      bats[i].display();
      bats[i].fall();
      //bats[i].detect();
    }

    for(var i=0; i<bullets.length; i++) {
      bullets[i].display();
      bullets[i].move();

      if (bullets[i].y <= 0) { // splice bullet once it hits top of the screen
         bullets.splice(i,1);
         break;
      }

      for (var j=0; j<bats.length; j++){
        if (dist(bullets[i].x, bullets[i].y, bats[j].x, bats[j].y) < 55) {
          score += bats[i].points;
          bats[i].points = 0;
          bullets.splice(i,1);
          bats.splice(j,1);
          i--;
          j--;
          break;
        }
      }
    }
    imageMode(CORNER);
    image(topbar, 0,0, 300,40);
    fill(0);
    textFont('Helvetica');
    textSize(18);
    text(score, 10,18);

    //timer, display seconds left as an integer
    var time = millis();
    text(int((end - time)/1000), 260, 18);

    //when timer runs out - game is over
    if (time > end) {
      state = 2;
    }
  }

//end the game
  if(state == 2) {
    imageMode(CORNER);
    background(endscreen, 250,250, 1000,500);
    fill(254,241,237);
    noStroke();
    rect(40,170,255,25);
    fill(0);
    textFont('Helvetica');
    textSize(24);
    text("Score: " + score, 75,190);

    fill(247,232,218);
    ellipse(150,308,70,30);
    ellipse(220,365,70,30);

    fill(0);
    text("Play", 127,315);
    textSize(8);
    text("By Chantelle & Sophie", 179,369);



  }
}

//class for jumping player
class jumper {
  constructor(x,y) {
    this.x = x;
    this.y = y;

    this.ySpeed = 0;

    //jumper starts facing right
    this.graphic = playerR;
  }

  display() {
    image(this.graphic, this.x, this.y, 40,45);
    this.y += this.ySpeed;

    //make the jumper move unless it's on the bottom of the screen
    if (this.y < 460) {
      this.ySpeed += 0.1;
    }

  }

  move() {

    //wraparound logic so the jumper doesnt disappear
    if (this.x < 0) {
      this.x = width;
    }
    if (this.x > width) {
      this.x = 0;
    }
    if (this.y < 85){
      this.y = 85;
    }

    //ends the game if the doodle falls through the bottom
    if (this.y >= 500) {
      state = 2;
    }

    if (keyIsDown(37)) {
      // move left
      this.x -= 2;
      // left graphic
      this.graphic = playerL;
    }

    if (keyIsDown(39)) {
      // move right
      this.x += 2;
      // right graphic
      this.graphic = playerR;
    }

    if (keyIsDown(32)) { //can we make this the space bar
      this.graphic = playerUp;
    }
  }

  detect() {
    //if the player is moving
    if (this.ySpeed >=0) {

      //detect for green paddles
      for (var i = 0; i < greenPaddles.length; i++) {
        if (greenPaddles[i].y - this.y < 45 && greenPaddles[i].y - this.y > 45 - 2*this.ySpeed) {
          if(this.x > greenPaddles[i].x-62.5 && this.x < greenPaddles[i].x+22.5){
            this.ySpeed = 0;
            this.y = greenPaddles[i].y - 40;
            this.jump = false;
            jumpsound.play();
            score += greenPaddles[i].points;

            //makes it jump when on top of paddles
            if (this.ySpeed >= 0) {
              this.ySpeed = -4;
              this.jump = true;
              jumpsound.play();
              greenPaddles[i].points = 0;
            }
          }
        }
      }
    }

    //detect for spring paddles
    for (var i = 0; i < springPaddles.length; i++) {
      if (springPaddles[i].y - this.y < 60 && springPaddles[i].y - this.y > 55 - 2*this.ySpeed) {
        if(this.x > springPaddles[i].x-62.5 && this.x < springPaddles[i].x+22.5){
          this.ySpeed = 0;
          this.y = springPaddles[i].y - 40;
          this.jump = false;
          springsound.play();
          score += springPaddles[i].points;

          //makes it jump when on top of paddles - the spring paddle makes it jump higher, so we gave it a higher ySpeed
          if (this.ySpeed >= 0) {
            this.ySpeed = -8;
            this.jump = true;
            currentSpImage = image(springGraphics[1], this.x, this.y, 45,20);
            springsound.play();
            springPaddles[i].points = 0;
          }
        }
      }
    }


    //detect for moving paddles
    for (var i = 0; i < movingPaddles.length; i++) {
      if (movingPaddles[i].y - this.y < 45 && movingPaddles[i].y - this.y > 45 - 2*this.ySpeed) {
          if(this.x > movingPaddles[i].x-62.5 && this.x < movingPaddles[i].x+22.5){
          this.ySpeed = 0;
          this.y = movingPaddles[i].y - 40;
          this.jump = false;
          jumpsound.play();
          score += movingPaddles[i].points;

          //makes it jump when on top of paddles
          if (this.ySpeed >= 0) {
            this.ySpeed = -4;
            this.jump = true;
            jumpsound.play();
            movingPaddles[i].points = 0;
          }
        }
      }
    }

    //detect for broken paddles
    for (var i = 0; i < brokenPaddles.length - 1; i++) {
      //if the broken paddle is showing, it can be hit - play the sound
      if (brokenPaddles[i].brCurrentFrame >= 0 && brokenPaddles[i].brCurrentFrame <=5) {
        if (brokenPaddles[i].y - this.y < 50 && brokenPaddles[i].y - this.y > 45 - 2*this.ySpeed) {
          if(this.x > brokenPaddles[i].x-62.5 && this.x < brokenPaddles[i].x+22.5){
            brokenPaddles[i].hit = true;
            if (brokenPaddles[i].hit = true){
              brokensound.play();
                score += brokenPaddles[i].points;
                brokenPaddles[i].points = 0;

            }
          }
        }
      }

      //if the broken paddle image is transparent, it can't be hit - don't play the sound
      else if(brokenPaddles[i].brCurrentFrame >=6) {
        this.hit = false;
      }
    }

    // detect bats
    for (var i = 0; i < bats.length; i++) {
      if (dist(bats[i].x, bats[i].y, this.x, this.y) < 45) {
        state = 2;
        console.log(state);
        }
      }
    }
  }

//regular green paddle class
class greenPaddle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.points = 4;
  }

  //make paddle appear
  display() {
    imageMode(CENTER);
    image(gpaddle, this.x, this.y, 45,10);
  }

  //makes the paddles move as the player jumps
  fall() {
    if (player.jump = true) {
      var movement = player.ySpeed;
      movement *= -1;
      this.y += movement;
    }
  }
}

//spring paddle class
class springPaddle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.points = 8;
  }

  //make paddle appear
  display() {
    imageMode(CENTER);
    currentSpImage = image(springGraphics[0], this.x, this.y, 45,20);
  }

  //makes the paddles move as the player jumps
  fall() {
    if (player.jump = true) {
      var movement = player.ySpeed;
      movement *= -1;
      this.y += movement;
    }
  }
}

//moving paddle class
class movingPaddle {
  constructor(x,y, speed, start, end) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.start = start;
    this.end = end;
    this.points = 6;
  }

  //make paddle appear
  display() {
    imageMode(CENTER);
    image(bpaddle, this.x, this.y, 45,10);
  }

  //makes the paddles move back and forth at random speeds and from random start and end points
  move() {
    this.x += this.speed;
    if(this.x > this.end || this.x < this.start) {
      this.speed *= -1;
    }
  }

  //makes the paddles move as the player jumps
  fall() {
    if (player.jump = true) {
      var movement = player.ySpeed;
      movement *= -1;
      this.y += movement;
    }
  }
}

//breaking paddle class
class brokenPaddle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.brCurrentFrame = 0;
    this.hit = false;
    this.state = true;
    this.points = -10;
  }

  //make paddle appear
  display() {
    if (this.state) {
      imageMode(CENTER);
      currentBrImage = image(brokenGraphics[this.brCurrentFrame], this.x, this.y, 45,10);

      if (this.hit) {
        this.brCurrentFrame += 1;
      }

      if (this.brCurrentFrame >= brokenGraphics.length) {
        this.state = false;
      }
    }

  }

  //makes the paddles move as the player jumps
  fall() {
    if (this.state) {
      if (player.jump = true) {
        var movement = player.ySpeed;
        movement *= -1;
        this.y += movement;
      }
    }
  }
}

//bullet class
class bulletClass {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.ySpeed = -5;
  }

  display() {
    this.image = image(bullet, this.x,this.y,10,10);
  }
  move() {
      this.y += this.ySpeed;
  }
}

//bat class
class bat {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.batCurrentFrame = random(0,29);
    this.points = 20;
  }

  //make bat appear and move
  display() {
    imageMode(CENTER);
    image(batGraphics[int(this.batCurrentFrame/10)], this.x, this.y, 60,40);
    this.batCurrentFrame += 1;
    if(this.batCurrentFrame >29) {
      this.batCurrentFrame = 0;
    }
  }

  //makes the bats move as the player jumps
  fall() {
    if (player.jump = true) {
      var movement = player.ySpeed;
      movement *= -1;
      this.y += movement;
    }
  }
}

//shoot bullets when the space bar is pressed
function keyPressed() {
    if (keyCode == 32) {
      bullets.push( new bulletClass(player.x + 20, player.y));
      shotsound.play();
    }
    return false;
}

//change states when the mouse is pressed
function mousePressed() {
  if (state == 0) {
    state = 1;
    end = 300000;
  }

  else if (state == 2) {
    state = 0;
    reset();
  }
}

function reset() {
  //reset the entire game
  //reset timer and score
  end = 300000;
  score = 0;

  //new player
  player = new jumper(150,300);
  springPaddles.push( new springPaddle(170,490));

  greenPaddles = [];
  springPaddles = [];
  movingPaddles = [];
  brokenPaddles = [];
  bats = [];
  bullets = [];

  //generate a random paddle type or bat every 40 pixels
  for(var y = 500; y > -10000; y-=40){
    var randomnum = random(1,100);
    if (randomnum >=1 && randomnum <= 50) {
      greenPaddles.push( new greenPaddle(random(width), y));
    }
    if (randomnum > 50 && randomnum <= 70) {
      springPaddles.push( new springPaddle(random(width), y));
    }
    if (randomnum >70 && randomnum <= 80) {
      var temp = random(0, width/2);
      movingPaddles.push( new movingPaddle(temp, y, random(0.5,2), temp, random(width/2, width)));
    }
    if (randomnum >80 && randomnum <= 90) {
      brokenPaddles.push( new brokenPaddle(random(width), y));
    }
    if (randomnum >90 && randomnum <= 100) {
      bats.push( new bat(random(width), y));
    }
  }
}
