//TODO: prevest

//proporcije nisu uvijek idealne, ali igra funkcionira na svim uređajima

/*SETTINGS */
//all the level settings will be defined in this map
const levels = new Map();
levels.set(1, {
  //the current level
  current: 1,
  //the next level
  next: 2,
  backgroundUrl: "assets/pucisca.jpg",
  gravity: 1.1,
  speed: 1.1,
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

/*ENTITIES */
class Physics {
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

class Seagull extends Drawable {
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

class Pipe extends Drawable {
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

/*COMPONENT */

//the template is used as the component's rendered html
const template = document.createElement("template");
template.innerHTML = `
<style>
*,
*::after,
*::before {
  box-sizing: border-box;
}

:host,canvas{
  display: block;
  width: 100%;
  height: auto;
}

canvas {
  background-image: url("assets/pucisca.jpg");
  /* width: 1366px;
  height: 800px;*/
  width: 100%;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.canvas-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
#overlay {
  z-index: 4;
  position: absolute;
  height: 90%;
  width: 90%;
}

.display{
  padding: 0.6rem;
  background: hsla(130,60%,30%,0.9);
  border-radius: 4px;
  color: white;
  box-shadow: 0px 1px 1px rgba(0,0,0,0.2);
 }
#scoreCounter,#levelCounter{
  font-weight: bold;
  font-family: roboto;
  font-size: 1.2rem;
}


.info-display{
  box-shadow: 0 2px 2px 2px rgba(0,0,0,0.4);
  background: hsla(130,60%,30%,0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  flex-flow: row wrap;
  opacity: 1;
}

.info-display>*{
  flex: 1 0 100%;
  display: block;
}

.game-info{
  width: 90%;
  background: hsla(130,60%,20%,0.95); 
}


.info-display.hidden{
  opacity:0;
}

/*TODO: refactor*/
#overlay.shown {
  pointer-events: none;
  z-index: 5;
  background: hsla(130, 50%, 50%, 0.9);
}


</style>

<div class="canvas-container flexCC">
  <div id="overlay" class="">
    <span class="display">LEVEL <span id="levelCounter">1</span></span>
    <span class="display">score: <span id="scoreCounter">0</span></span>
    <div class="display info-display">
      <p class="display game-info" id="gameInfo">E</p>
      </div>
  </div>

  <canvas id="canvas" width="1000" height="100"></canvas>
</div>`;

class FlappyGaleb extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(template.content.cloneNode(true));
    //TODO: refactor into a web component (maybe)
    this.canvas = this.$root.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  connectedCallback() {
    let isRunning = false;
    let distance = 0;
    let pipes = [];

    //TODO: add max distance to levels
    let currentLevel = levels.get(1);

    const { ctx, canvas } = this;

    //setting up the canvas
    canvas.style.backgroundImage = `url(${currentLevel.backgroundUrl})`;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // const toggleButton = document.getElementById("toggleButton");
    const scoreCounter = this.$root.getElementById("scoreCounter");
    const levelCounter = this.$root.getElementById("levelCounter");
    const gameInfo = this.$root.getElementById("gameInfo");

    const { gravity, speed } = currentLevel;
    const physics = new Physics({ gravity, speed });

    const seagullImg = new Image(300, 300);
    seagullImg.src = "assets/galeb.svg";
    const seagull = new Seagull({
      ctx,
      img: seagullImg,
      x: 0,
      y: 0,
      width: canvas.clientHeight / 2
    });

    const hasCollided = ({ seagull, object }) => {
      //calculating approximate distances between the centres of the seagull and the object on both axes
      //the results are suprisingly accurate
      return (
        Math.sqrt((seagull.y - object.y) ** 2 + (seagull.x - object.x) ** 2) <
        //the factor by which the height is multiplied effectively signifies collision sensitivity
        object.height * 0.7
      );
    };

    //advancing to the next level
    const nextLevel = () => {
      if (currentLevel && currentLevel.next) {
        const next = levels.get(currentLevel.next);
        //if there is no next level (if it's undefinded) the function does nothing
        if (!next) {
          return;
        }
        //if there is a next level it sets it as the current level and updates the background and the physics variables
        currentLevel = next;
        canvas.style.backgroundImage = `url(${next.backgroundUrl})`;
        physics.speed = next.speed;
        physics.gravity = next.gravity;
        levelCounter.textContent = next.current;
        return next;
      }
    };

    const end = () => {
      gameInfo.textContent = `REZULTAT: ${distance}`;
      distance = 0;
      gameInfo.parentElement.classList.remove("hidden");
      let first = levels.get(1);
      currentLevel = first;
      levelCounter.textContent = first.current;
      isRunning = false;
      //TODO: move this setup to a new function
      canvas.style.backgroundImage = `url(${first.backgroundUrl})`;
      physics.speed = first.speed;
      physics.gravity = first.gravity;
    };

    const drawPipes = () => {
      //removing the first pipe reached if it reached the left edge
      if (pipes[0] && pipes[0].x === 0) {
        pipes.shift();
      }
      //moving and drawing all pipes
      //using forEach and not map because the function returns nothing

      pipes.forEach(pipe => {
        pipe.draw({});
        pipe.x -= 2 * physics.speed;
        if (hasCollided({ seagull, object: pipe })) {
          end();
        }
      });
    };

    const generatePipe = () =>
      pipes.push(
        new Pipe({
          canvasHeight: canvas.clientHeight,
          ctx,
          //TODO: random multipliers (and randomize height in gameSettings)
          x: canvas.clientWidth,
          width: 100,
          position: Math.round(Math.random()) ? "top" : "bottom"
        })
      );

    const areLastNPipesOnTheSameSide = (n = 3) => {
      let lastNPipes = [...pipes].splice(n);
      return (
        lastNPipes.every(pipe => pipe.position === "top") ||
        lastNPipes.every(pipe => pipe.position === "bottom")
      );
    };
    pipes.length >= 2 &&
      pipes[pipes.length - 1].position === pipes[pipes.length - 2].position;
    const notEnoughSpace =
      pipes.length > 3 &&
      //TODO
      pipes[pipes.length - 1].x - pipes[pipes.length - 2].x <
        //dividing by the modifier set in the levels map
        //higher modifier means smaller minimum distance between pipes
        150 / currentLevel.pipeFrequencyModifier;
    //the animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //drawing the seagull first so it's in the bottom layer

      seagull.draw({});
      seagull.y += physics.gravity;
      distance += Math.round(1 * currentLevel.speed);
      //displaying the current distance ("" + number implicit converts it to a string)
      scoreCounter.textContent = "" + distance;
      if (distance === currentLevel.totalDistance) {
        nextLevel();
      }

      //a random integer between lower than 1000 generated on every redraw used to randomly create pipes
      const randomizer = Math.floor(Math.random() * 1000);

      if (randomizer < 6 * currentLevel.pipeFrequencyModifier) {
        //if there are any pipes, it generates a pipe only if the distance between the last one
        //and the new one would be sufficient
        pipes.length ? !notEnoughSpace && generatePipe() : generatePipe();
      }
      //the movement of the seagull forward is simulated by moving the pipes further to the left
      drawPipes();

      const req = requestAnimationFrame(animate);
      if (!isRunning) {
        cancelAnimationFrame(req);
      }
    };

    const run = () => {
      if (!isRunning) {
        isRunning = true;
      }
      animate();
    };

    const stop = () => {
      if (isRunning) {
        isRunning = false;
      }
    };

    //sets up the keyboard events
    const listenToKB = () =>
      window.addEventListener("keydown", e => {
        //(the spacebar)
        if (e.keyCode === 32) {
          if (!isRunning) {
            run();
          }
          seagull.jump({ multiplier: 2 / physics.gravity });
        } else if (e.key === "p") {
          if (gameInfo.parentElement.classList.contains("hidden")) {
            gameInfo.textContent = "PAUZIRANO";
          }
          gameInfo.parentElement.classList.toggle("hidden");
          toggleActive();
        }
      });

    const toggleActive = () => {
      isRunning ? stop() : run();
    };

    seagullImg.onload = () => {
      listenToKB();
    };
  }
}

window.customElements.define("ie-flappy-galeb", FlappyGaleb);
