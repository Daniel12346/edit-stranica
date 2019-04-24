//TODO: delete (maybe)
//all the level settings will be defined in this map
export const levels = new Map();

levels.set(1, {
  //the current level
  current: 1,
  //the next level
  next: 2,
  backgroundUrl: "assets/pucisca.jpg",
  gravity: 1,
  speed: 1,
  pipeFrequencyModifier: 1,
  //total distance is the overall distance passed through all the levels, including the current one,
  //that is needed to progress to the next level
  totalDistance: 1000
});

levels.set(2, {
  current: 2,
  next: 3,
  backgroundUrl: "assets/postira.jpg",
  gravity: 1.4,
  speed: 1.7,
  pipeFrequencyModifier: 1.6,
  totalDistance: 1500
});

levels.set(3, {
  current: 3,
  next: 1,
  backgroundUrl: "assets/supetar.JPG",
  gravity: 1.9,
  speed: 2.3,
  pipeFrequencyModifier: 2,
  totalDistance: 200
});

export class Physics {
  constructor({ gravity, speed }) {
    //determines how fast the seagull falls
    this.gravity = gravity;
    //determines how fast the pipes move
    this.speed = speed;
  }
}
//the base class all other drawable object classes will inherit from
class Drawable {
  constructor({ ctx, img, x = 0, y = 0, width, height }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.img = img;
    this.width = width;
    this.height = height;
  }
  draw({ x = this.x, y = this.y, width = this.width, height = this.height }) {
    this.ctx.drawImage(this.img, x, y, width, height);
  }
  //the multiplier will be calculated using gravity
  jump({ multiplier }) {
    this.y -= multiplier * 15;
  }
}

export class Seagull extends Drawable {
  //the first parameter in the constructor is the canvas drawing context
  constructor({ ctx, img, x = 0, y = 0, width = 300, height = 300 }) {
    super({ ctx, img, x, y, width, height });
  }
  //the multiplier will be calculated using gravity
  jump({ multiplier }) {
    this.y -= multiplier * 15;
  }
}

//TODO: fix or delete
const randomPipeSize = height =>
  height / 3 - Math.floor((Math.random() * 7 * height) / 2);

export class Pipe extends Drawable {
  constructor({ ctx, position = "top", width = 20, height, canvasHeight, x }) {
    super({ ctx, width, x });
    //  this.position = position;
    this.position = position;
    this.canvasHeight = canvasHeight;
    //the height of the pipe is determined by the height of the canvas, making it responsive
    this.height =
      canvasHeight / 3.5 + Math.round(Math.random() * canvasHeight * 0.1);
    this.y =
      this.position === "top"
        ? 0
        : 0.75 * canvasHeight + Math.floor(Math.random() * 30);
  }
  draw({ x = this.x, y = this.y, width = this.width, height = this.height }) {
    const gradient = this.ctx.createLinearGradient(x, y, width, height);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.6, "black");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
    //drawing the top of the pipe
    this.ctx.fillRect(
      //x offset
      x - 20,
      //y ofset
      this.position === "top" ? y + height : y,
      //width
      1.4 * width,
      //height
      height / 10
    );
  }
  //TODO: class PowerUp
}
