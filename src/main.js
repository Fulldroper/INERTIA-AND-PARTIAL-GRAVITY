const vw = _ => window.innerWidth
const vh = _ => window.innerHeight

window.onresize = _ => resizeCanvas(vw(), vh())

const bots = []

function setup() {
  createCanvas(vw(), vh());
  // noCursor()
  // frameRate(60);
}


function mouseReleased() {
  bots.push(
    new bot({
      x: mouseX,
      y: mouseY,
      size: rand(20, 5),
      speed: rand(200, 5),
      coefficient: 1
    })
  )
}

function draw() {
  clear()
  background("#363c49");
  bots.forEach(bot => {
    bot.inertiaMoveTo(vw() / 2, vh() / 2)
    bot.render()
  })
  fill(255)
  ellipse(vw() / 2, vh() / 2, 5, 5);
  textSize(16);
  text(`FPS: ${getTargetFrameRate()}`, 10, 20);
  textSize(14);
  text(`Circles: ${bots.length}`, 10, 40);
  textSize(26);
  text(`Click to spawn circle`, (vw() / 2 ) - 110 , vh() - 20);
}

function rand(max, min = 0) {
  return Math.random() * (max - min) + min;
}


class bot {
  constructor(options = {}) {
    const {
      x, y, size = 1, speed = 1, coefficient = 0.1, color = [rand(255), rand(150, 10), 255]
    } = options;

    this.x = x;
    this.y = y;
    
    this.color = color

    this.size = size;

    this.speed = speed;
    this.coefficient = coefficient

    this.dirX = true;
    this.dirY = true;

    this.velocityX = 0;
    this.velocityY = 0;
  }

  render() {
    colorMode(HSB);
    fill(...this.color);
    ellipse(this.x, this.y, this.size, this.size);
    fill(255, 255, 255);
  }

  moveTo(x, y) {
    x > this.x ? this.x += this.speed : this.x -= this.speed;
    y > this.y ? this.y += this.speed : this.y -= this.speed;
  }

  inertiaMoveTo(x, y) {
    // calculate direction to target
    const nowDirX = x > this.x
    const nowDirY = y > this.y

    // change cached direction if move stopped
    this.velocityX == 0 && (this.dirX = nowDirX)
    this.velocityY == 0 && (this.dirY = nowDirY)

    // change speed of move for inertia
      this.dirX == nowDirX ?
        this.velocityX < this.speed ? 
          this.velocityX += this.coefficient:
          this.speed:
        this.velocityX > 0 ?
          this.velocityX -= this.coefficient:
          0;

      this.dirY == nowDirY ?
        this.velocityY < this.speed ?
          this.velocityY += this.coefficient:
          this.speed:
        this.velocityY > 0 ?
          this.velocityY -= this.coefficient:
          0;

    // make move vector
    this.dirX ? this.x += this.velocityX : this.x -= this.velocityX;
    this.dirY ? this.y += this.velocityY : this.y -= this.velocityY;
  }
}